import type { RepoOverride } from "./content";

export interface RepoCard {
  fullName: string;
  name: string;
  description: string;
  tech: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string;
  url: string;
  homepage: string | null;
}

/** GitHub's brand colors for the languages likely to appear in these repos. */
const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  Java: "#b07219",
  "C++": "#f34b7d",
  "C#": "#178600",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  PHP: "#4F5D95",
  Svelte: "#ff3e00",
  Vue: "#41b883",
  Astro: "#ff5a03",
  Shell: "#89e051",
  Go: "#00ADD8",
  Rust: "#dea584",
  Ruby: "#701516",
  Dart: "#00B4AB",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  "Jupyter Notebook": "#DA5B0B",
  Dockerfile: "#384d54",
};

const FALLBACK_COLOR = "#9aa0b4";

function languageColor(language: string | null): string {
  if (!language) return FALLBACK_COLOR;
  return LANGUAGE_COLORS[language] ?? FALLBACK_COLOR;
}

/** Build a card from local data only — used as a fallback when the API is unreachable. */
function fallbackCard(fullName: string, override?: RepoOverride): RepoCard {
  const name = fullName.split("/").pop() ?? fullName;
  return {
    fullName,
    name,
    description: override?.tagline ?? "",
    tech: override?.tech ?? null,
    stars: 0,
    forks: 0,
    language: null,
    languageColor: FALLBACK_COLOR,
    url: `https://github.com/${fullName}`,
    homepage: null,
  };
}

async function fetchRepo(fullName: string, override?: RepoOverride): Promise<RepoCard> {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "anmarhani-portfolio-build",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, { headers });
    if (!res.ok) {
      console.warn(`[github] ${fullName} → HTTP ${res.status}; using fallback content.`);
      return fallbackCard(fullName, override);
    }
    const repo = (await res.json()) as {
      name: string;
      description: string | null;
      stargazers_count: number;
      forks_count: number;
      language: string | null;
      html_url: string;
      homepage: string | null;
    };
    return {
      fullName,
      name: repo.name,
      // The curated tagline (per-language) wins over GitHub's raw description.
      description: override?.tagline ?? repo.description ?? "",
      tech: override?.tech ?? null,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      language: repo.language,
      languageColor: languageColor(repo.language),
      url: repo.html_url || `https://github.com/${fullName}`,
      homepage: repo.homepage && repo.homepage.trim() ? repo.homepage : null,
    };
  } catch (err) {
    console.warn(`[github] ${fullName} fetch failed (${(err as Error).message}); using fallback.`);
    return fallbackCard(fullName, override);
  }
}

/**
 * Fetch live data for the curated featured repos at build time.
 * Capped at 3 cards. Never throws — falls back to local content on any failure.
 */
export async function getFeaturedRepos(
  fullNames: string[],
  overrides: Record<string, RepoOverride> = {},
): Promise<RepoCard[]> {
  const selected = fullNames.slice(0, 3);
  return Promise.all(selected.map((fullName) => fetchRepo(fullName, overrides[fullName])));
}
