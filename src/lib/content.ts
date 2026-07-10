import data from "../data/content.json";

export type Lang = "en" | "ar";

export interface SiteLinks {
  github: string;
  linktree: string;
  cal: string;
  hashnode: string;
}

export interface SiteConfig {
  name: string;
  githubUsername: string;
  featuredRepos: string[];
  links: SiteLinks;
}

export interface RepoOverride {
  tagline?: string;
  tech?: string;
}

export interface LocaleContent {
  meta: { title: string; description: string };
  hero: { greeting: string; title: string; subtitle: string; brief: string; cta: string };
  about: {
    eyebrow: string;
    title: string;
    summary: string;
    certifications: string;
    certs: string[];
    consultation: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    intro: string;
    explore: string;
    more: string;
    overrides: Record<string, RepoOverride>;
  };
  experience: {
    eyebrow: string;
    title: string;
    company: string;
    role: string;
    period: string;
    details: string[];
  };
  services: { eyebrow: string; title: string; intro: string; items: string[] };
  publications: {
    eyebrow: string;
    title: string;
    explore: string;
    more: string;
    items: { name: string; desc: string; tech: string; link: string }[];
  };
  tv: {
    channel: string;
    play: string;
    rec: string;
    live: string;
    selectTape: string;
    signoff: string;
    remoteLabel: string;
    power: string;
    chUp: string;
    chDown: string;
  };
  langSwitcher: { en: string; ar: string };
}

const content = data as unknown as {
  site: SiteConfig;
  en: LocaleContent;
  ar: LocaleContent;
};

export const site: SiteConfig = content.site;

/** The broadcast lineup: every section is a channel, tuned via tapes/remote. */
export interface Channel {
  id: string;
  num: string;
  key: "about" | "projects" | "experience" | "services" | "publications";
  sticker: string;
  /** Dark sticker text for light sticker colors (yellow/green). */
  stickerInk?: boolean;
}

export const channels: Channel[] = [
  { id: "ch-02", num: "02", key: "about", sticker: "var(--color-vhs-red)" },
  { id: "ch-03", num: "03", key: "projects", sticker: "var(--color-vhs-purple)" },
  { id: "ch-04", num: "04", key: "experience", sticker: "var(--color-vhs-blue)" },
  { id: "ch-05", num: "05", key: "services", sticker: "var(--color-vhs-yellow)", stickerInk: true },
  { id: "ch-06", num: "06", key: "publications", sticker: "var(--color-phosphor)", stickerInk: true },
];

/** Resolve the content bundle for a given locale, falling back to English. */
export function getContent(lang: string | undefined): LocaleContent {
  return lang === "ar" ? content.ar : content.en;
}
