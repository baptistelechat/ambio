import type { IncomingMessage } from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { Duplex } from "node:stream";
import ical, { type VEvent } from "node-ical";
import Parser from "rss-parser";
import type { Connect, Plugin } from "vite";
import { WebSocketServer } from "ws";
import { NEWS_FEED_CATALOG, NEWS_TOPIC_CATALOG } from "../src/lib/newsFeeds.ts";
import { configSchema, defaultConfig } from "../src/lib/types.ts";
import { normalizeConfig } from "../src/lib/configMigration.ts";

type UpgradeCapableServer = {
  on(
    event: "upgrade",
    listener: (req: IncomingMessage, socket: Duplex, head: Buffer) => void,
  ): unknown;
} | null;

const CONFIG_PATH = path.resolve(process.cwd(), "config.json");
const ASSETS_DIR = path.resolve(process.cwd(), "public/assets");

const readConfig = () => {
  if (!fs.existsSync(CONFIG_PATH)) return defaultConfig;
  const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
  return configSchema.parse(normalizeConfig(raw));
};

const writeConfig = (config: unknown) => {
  const parsed = configSchema.parse(normalizeConfig(config));
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(parsed, null, 2));
  return parsed;
};

const collectBody = (req: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });

const ALLOWED_UPLOAD_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".mp4",
  ".webm",
]);

const sanitizeFilename = (filename: string): string | null => {
  const ext = path.extname(filename).toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.has(ext)) return null;
  const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
  return `${Date.now()}-${base}${ext}`;
};

const isSafeFetchUrl = (rawUrl: string): boolean => {
  try {
    return ["http:", "https:"].includes(new URL(rawUrl).protocol);
  } catch {
    return false;
  }
};

type NewsApiItem = {
  title: string;
  link: string;
  source: string;
  pubDate: string;
};

const MAX_NEWS_FEEDS = 8;
const MAX_NEWS_TOPICS = 20;
const MAX_NEWS_ITEMS_PER_FEED = 15;
const MAX_NEWS_ITEMS = 30;
const rssParser = new Parser({ timeout: 8000 });

const parseJsonStringArray = (value: string | null, max: number): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((v): v is string => typeof v === "string" && v.trim() !== "")
      .slice(0, max);
  } catch {
    return [];
  }
};

const CPU_THERMAL_ZONE_PATH = "/sys/class/thermal/thermal_zone0/temp";

const readCpuTempC = (): number | null => {
  try {
    const raw = fs.readFileSync(CPU_THERMAL_ZONE_PATH, "utf-8");
    return parseInt(raw, 10) / 1000;
  } catch {
    // Absent hors Linux/RPi (ex: dev sur Windows) — pas une erreur.
    return null;
  }
};

const readRamUsedPercent = (): number =>
  Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100);

const fetchNewsItems = async (
  feedIds: string[],
  topicIds: string[],
): Promise<NewsApiItem[]> => {
  const feedIdSet = new Set(feedIds);
  const topicIdSet = new Set(topicIds);
  const feeds = NEWS_FEED_CATALOG.filter((feed) => feedIdSet.has(feed.id));
  const keywords = NEWS_TOPIC_CATALOG.filter((topic) =>
    topicIdSet.has(topic.id),
  )
    .flatMap((topic) => topic.keywords)
    .map((keyword) => keyword.trim().toLowerCase());

  const results = await Promise.allSettled(
    feeds.map(async (feedSource) => {
      const feed = await rssParser.parseURL(feedSource.url);
      return (feed.items ?? []).slice(0, MAX_NEWS_ITEMS_PER_FEED).map(
        (item): NewsApiItem => ({
          title: item.title ?? "",
          link: item.link ?? "",
          pubDate: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
          source: feedSource.label,
        }),
      );
    }),
  );

  const byLink = new Map<string, NewsApiItem>();
  for (const item of results
    .filter(
      (r): r is PromiseFulfilledResult<NewsApiItem[]> =>
        r.status === "fulfilled",
    )
    .flatMap((r) => r.value)
    .filter((item) => item.title)) {
    // Une même dépêche apparaît parfois deux fois dans un même flux
    // (pagination/cache côté éditeur) ou sur deux flux syndiqués — sans ça,
    // le bandeau (DOM ou texte vidéo) répète deux fois la même dépêche.
    if (!byLink.has(item.link || item.title)) {
      byLink.set(item.link || item.title, item);
    }
  }
  let items = Array.from(byLink.values());

  if (keywords.length > 0) {
    items = items.filter((item) =>
      keywords.some((keyword) => item.title.toLowerCase().includes(keyword)),
    );
  }

  return items
    .sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    )
    .slice(0, MAX_NEWS_ITEMS);
};

const setupApi = (
  middlewares: Connect.Server,
  httpServer: UpgradeCapableServer,
) => {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
  if (!fs.existsSync(CONFIG_PATH)) writeConfig(defaultConfig);

  const wss = new WebSocketServer({ noServer: true });
  httpServer?.on("upgrade", (req, socket, head) => {
    if (req.url === "/ws") {
      wss.handleUpgrade(req, socket, head, (ws) =>
        wss.emit("connection", ws, req),
      );
    }
  });

  const broadcastConfigUpdated = () => {
    const message = JSON.stringify({ type: "config-updated" });
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(message);
    }
  };

  middlewares.use(async (req, res, next) => {
    if (!req.url) return next();
    const url = new URL(req.url, "http://localhost");

    if (url.pathname === "/api/config" && req.method === "GET") {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(readConfig()));
      return;
    }

    if (url.pathname === "/api/config" && req.method === "POST") {
      try {
        const body = JSON.parse(await collectBody(req));
        const saved = writeConfig(body);
        broadcastConfigUpdated();
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ status: "ok", config: saved }));
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            status: "error",
            message: (err as Error).message,
          }),
        );
      }
      return;
    }

    if (url.pathname === "/api/upload" && req.method === "POST") {
      try {
        const { filename, dataBase64 } = JSON.parse(await collectBody(req)) as {
          filename: string;
          dataBase64: string;
        };
        const safeName = sanitizeFilename(filename);
        if (!safeName) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              status: "error",
              message: "unsupported file type",
            }),
          );
          return;
        }
        fs.writeFileSync(
          path.join(ASSETS_DIR, safeName),
          Buffer.from(dataBase64, "base64"),
        );
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ url: `/assets/${safeName}` }));
      } catch (err) {
        res.statusCode = 500;
        res.end(
          JSON.stringify({
            status: "error",
            message: (err as Error).message,
          }),
        );
      }
      return;
    }

    if (url.pathname === "/api/agenda" && req.method === "GET") {
      const icsUrl = url.searchParams.get("url");
      if (!icsUrl || !isSafeFetchUrl(icsUrl)) {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            status: "error",
            message: "missing or invalid url param",
          }),
        );
        return;
      }
      try {
        const events = await ical.async.fromURL(icsUrl);
        const now = Date.now();
        const upcoming = Object.values(events)
          .filter((e): e is VEvent => e?.type === "VEVENT")
          .filter((e) => new Date(e.end ?? e.start).getTime() >= now)
          .sort(
            (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
          )
          .slice(0, 5)
          .map((e) => ({ title: e.summary, start: e.start, end: e.end }));
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(upcoming));
      } catch (err) {
        res.statusCode = 502;
        res.end(
          JSON.stringify({
            status: "error",
            message: (err as Error).message,
          }),
        );
      }
      return;
    }

    if (url.pathname === "/api/news" && req.method === "GET") {
      // Les flux ne sont plus des URLs arbitraires envoyées par le client
      // (checkboxes côté éditeur, voir NEWS_FEED_CATALOG) : on ne résout
      // que des ids connus, ce qui ferme la porte à un proxy SSRF vers une
      // URL choisie par l'appelant.
      const feedIds = parseJsonStringArray(
        url.searchParams.get("feeds"),
        MAX_NEWS_FEEDS,
      );
      const topicIds = parseJsonStringArray(
        url.searchParams.get("topics"),
        MAX_NEWS_TOPICS,
      );
      try {
        const items = await fetchNewsItems(feedIds, topicIds);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(items));
      } catch (err) {
        res.statusCode = 502;
        res.end(
          JSON.stringify({
            status: "error",
            message: (err as Error).message,
          }),
        );
      }
      return;
    }

    if (url.pathname === "/api/system-status" && req.method === "GET") {
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          cpuTempC: readCpuTempC(),
          uptimeSeconds: os.uptime(),
          ramUsedPercent: readRamUsedPercent(),
        }),
      );
      return;
    }

    next();
  });
};

export const screensaverApiPlugin = (): Plugin => ({
  name: "screensaver-api",
  configureServer(server) {
    setupApi(server.middlewares, server.httpServer);
  },
  configurePreviewServer(server) {
    setupApi(server.middlewares, server.httpServer);
  },
});
