export interface NewsFeedSource {
  id: string;
  label: string;
  url: string;
  category: string;
}

// Chaque flux a été validé manuellement via rss-parser (le même parseur que
// /api/news) avant d'être ajouté ici — un flux qui casse silencieusement en
// production est pire qu'un flux absent de la liste.
export const NEWS_FEED_CATALOG: NewsFeedSource[] = [
  {
    id: "lemonde-une",
    label: "Le Monde — À la une",
    url: "https://www.lemonde.fr/rss/une.xml",
    category: "Généraliste",
  },
  {
    id: "francetvinfo-titres",
    label: "France Info — Titres",
    url: "https://www.francetvinfo.fr/titres.rss",
    category: "Généraliste",
  },
  {
    id: "lefigaro-actu",
    label: "Le Figaro — Actualités",
    url: "https://www.lefigaro.fr/rss/figaro_actualites.xml",
    category: "Généraliste",
  },
  {
    id: "20minutes-une",
    label: "20 Minutes — À la une",
    url: "https://www.20minutes.fr/feeds/rss-une.xml",
    category: "Généraliste",
  },
  {
    id: "ouestfrance-continu",
    label: "Ouest-France — En continu",
    url: "https://www.ouest-france.fr/rss-en-continu.xml",
    category: "Généraliste",
  },
  {
    id: "bfmtv",
    label: "BFMTV — Fil info",
    url: "https://www.bfmtv.com/rss/news-24-7/",
    category: "Généraliste",
  },
  {
    id: "liberation",
    label: "Libération",
    url: "https://www.liberation.fr/arc/outboundfeeds/rss-all/?outputType=xml",
    category: "Généraliste",
  },
  {
    id: "lemonde-intl",
    label: "Le Monde — International",
    url: "https://www.lemonde.fr/international/rss_full.xml",
    category: "International",
  },
  {
    id: "francetvinfo-monde",
    label: "France Info — Monde",
    url: "https://www.francetvinfo.fr/monde.rss",
    category: "International",
  },
  {
    id: "lefigaro-intl",
    label: "Le Figaro — International",
    url: "https://www.lefigaro.fr/rss/figaro_international.xml",
    category: "International",
  },
  {
    id: "courrier-intl",
    label: "Courrier International",
    url: "https://www.courrierinternational.com/feed/all/rss.xml",
    category: "International",
  },
  {
    id: "bbc-news",
    label: "BBC News (EN)",
    url: "http://feeds.bbci.co.uk/news/rss.xml",
    category: "International",
  },
  {
    id: "lemonde-economie",
    label: "Le Monde — Économie",
    url: "https://www.lemonde.fr/economie/rss_full.xml",
    category: "Économie",
  },
  {
    id: "lemonde-sport",
    label: "Le Monde — Sport",
    url: "https://www.lemonde.fr/sport/rss_full.xml",
    category: "Sport",
  },
  {
    id: "francetvinfo-sport",
    label: "France Info — Sports",
    url: "https://www.francetvinfo.fr/sports.rss",
    category: "Sport",
  },
  {
    id: "lequipe",
    label: "L'Équipe",
    url: "https://dwh.lequipe.fr/api/edito/rss?path=/",
    category: "Sport",
  },
  {
    id: "lemonde-pixels",
    label: "Le Monde — Pixels (tech)",
    url: "https://www.lemonde.fr/pixels/rss_full.xml",
    category: "Tech & sciences",
  },
  {
    id: "numerama",
    label: "Numerama",
    url: "https://www.numerama.com/feed/",
    category: "Tech & sciences",
  },
  {
    id: "futura-sciences",
    label: "Futura Sciences",
    url: "https://www.futura-sciences.com/rss/actualites.xml",
    category: "Tech & sciences",
  },
];

export interface NewsTopic {
  id: string;
  label: string;
  keywords: string[];
}

// Chaque thème filtre les titres agrégés par correspondance de mots-clés
// (voir /api/news) — un thème sans correspondance dans le titre est exclu.
export const NEWS_TOPIC_CATALOG: NewsTopic[] = [
  {
    id: "politique",
    label: "Politique",
    keywords: [
      "politique",
      "gouvernement",
      "élection",
      "ministre",
      "président",
      "assemblée nationale",
      "sénat",
    ],
  },
  {
    id: "economie",
    label: "Économie",
    keywords: [
      "économie",
      "bourse",
      "inflation",
      "entreprise",
      "emploi",
      "marché",
      "budget",
    ],
  },
  {
    id: "international",
    label: "International",
    keywords: [
      "international",
      "monde",
      "guerre",
      "ukraine",
      "gaza",
      "chine",
      "états-unis",
      "europe",
    ],
  },
  {
    id: "sport",
    label: "Sport",
    keywords: [
      "sport",
      "football",
      "rugby",
      "tennis",
      "JO",
      "olympique",
      "ligue 1",
      "coupe",
    ],
  },
  {
    id: "tech",
    label: "Technologie",
    keywords: [
      "technologie",
      "numérique",
      "intelligence artificielle",
      " ia ",
      "smartphone",
      "informatique",
      "cyber",
    ],
  },
  {
    id: "culture",
    label: "Culture",
    keywords: [
      "culture",
      "cinéma",
      "musique",
      "livre",
      "exposition",
      "festival",
      "série",
    ],
  },
  {
    id: "sciences-sante",
    label: "Sciences & Santé",
    keywords: [
      "science",
      "santé",
      "recherche",
      "climat",
      "médecine",
      "espace",
      "hôpital",
    ],
  },
];
