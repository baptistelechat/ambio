import { type Config, configSchema } from "@/lib/types";
import { normalizeConfig } from "@/lib/configMigration";

export const fetchConfig = async (): Promise<Config> => {
  const res = await fetch("/api/config");
  if (!res.ok) throw new Error(`GET /api/config failed: ${res.status}`);
  return configSchema.parse(normalizeConfig(await res.json()));
};

export const publishConfig = async (config: Config): Promise<void> => {
  const res = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error(`POST /api/config failed: ${res.status}`);
};

export const uploadAsset = async (file: File): Promise<string> => {
  const dataBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  const res = await fetch("/api/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename: file.name,
      mimeType: file.type,
      dataBase64,
    }),
  });
  if (!res.ok) throw new Error(`POST /api/upload failed: ${res.status}`);
  const { url } = (await res.json()) as { url: string };
  return url;
};

type ConfigUpdatedHandler = () => void;

export const subscribeConfigUpdates = (
  onUpdate: ConfigUpdatedHandler,
): (() => void) => {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closedByCaller = false;

  const connect = () => {
    socket = new WebSocket(`${protocol}://${window.location.host}/ws`);
    socket.addEventListener("message", (event) => {
      try {
        const msg = JSON.parse(event.data as string) as { type?: string };
        if (msg.type === "config-updated") onUpdate();
      } catch {
        // ignore non-JSON messages
      }
    });
    socket.addEventListener("close", () => {
      if (!closedByCaller) reconnectTimer = setTimeout(connect, 2000);
    });
  };
  connect();

  return () => {
    closedByCaller = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    socket?.close();
  };
};
