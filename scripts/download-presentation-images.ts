/**
 * @module scripts/download-presentation-images
 * Downloads free images for presentation landmarks from Wikipedia API.
 * Saves to public/images/presentation/ (grayscale applied via CSS).
 *
 * Usage: npx tsx scripts/download-presentation-images.ts
 */

import { writeFile, mkdir } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const OUTPUT_DIR = resolve(__dirname, "../public/images/presentation");
const USER_AGENT =
  "MoonshotsMagic/1.0 (https://github.com/moonshots-magic; educational project)";

/** Landmark to Wikipedia article mapping. */
interface LandmarkImageConfig {
  id: string;
  wikiTitle: string;
  /** Alternative Wikipedia titles to try. */
  altTitles?: string[];
}

/** Maps each landmark to a Wikipedia article for its thumbnail. */
const LANDMARK_CONFIGS: LandmarkImageConfig[] = [
  {
    id: "fort-gatlin",
    wikiTitle: "Lake_Eola_Park",
    altTitles: ["History_of_Orlando,_Florida", "Orlando,_Florida"],
  },
  {
    id: "citrus-industry",
    wikiTitle: "Florida_Citrus_Tower",
    altTitles: ["Citrus_production", "Orange_(fruit)"],
  },
  {
    id: "cape-canaveral-origins",
    wikiTitle: "Cape_Canaveral_Space_Force_Station",
    altTitles: ["Cape_Canaveral,_Florida"],
  },
  {
    id: "mercury-program",
    wikiTitle: "Kennedy_Space_Center",
    altTitles: ["Project_Mercury"],
  },
  {
    id: "apollo-11",
    wikiTitle: "Apollo_11",
    altTitles: ["Saturn_V"],
  },
  {
    id: "disney-world",
    wikiTitle: "Magic_Kingdom",
    altTitles: ["Walt_Disney_World", "Cinderella_Castle"],
  },
  {
    id: "epcot",
    wikiTitle: "Epcot",
    altTitles: ["Spaceship_Earth_(Epcot)"],
  },
  {
    id: "universal-studios",
    wikiTitle: "Universal_Studios_Florida",
    altTitles: ["Universal_Orlando_Resort"],
  },
  {
    id: "space-shuttle",
    wikiTitle: "Space_Shuttle_Atlantis",
    altTitles: ["STS-135", "Space_Shuttle_program"],
  },
  {
    id: "creative-village",
    wikiTitle: "Downtown_Orlando",
    altTitles: ["Creative_Village", "Orlando,_Florida"],
  },
  {
    id: "orlando-today",
    wikiTitle: "Orlando,_Florida",
    altTitles: ["Central_Florida"],
  },
];

/** Wikipedia API response shape. */
interface WikiApiResponse {
  query?: {
    pages?: Record<
      string,
      {
        thumbnail?: { source?: string };
        pageimage?: string;
      }
    >;
  };
}

/**
 * Query Wikipedia API for an article's main image thumbnail.
 * @param title - Wikipedia article title.
 * @param thumbSize - Desired thumbnail width.
 * @returns Image URL or null.
 */
async function getWikipediaImage(
  title: string,
  thumbSize = 1200,
): Promise<string | null> {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=${thumbSize}`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) return null;
    const data = (await response.json()) as WikiApiResponse;
    const pages = data.query?.pages;
    if (!pages) return null;

    for (const page of Object.values(pages)) {
      if (page.thumbnail?.source) return page.thumbnail.source;
    }
  } catch {
    // Silently fail
  }

  return null;
}

/**
 * Download an image from a URL with proper headers.
 * @param url - Image URL.
 * @returns Image buffer.
 */
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    signal: AbortSignal.timeout(30_000),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

async function main() {
  console.log("Downloading presentation landmark images from Wikipedia...\n");

  await mkdir(OUTPUT_DIR, { recursive: true });

  let downloaded = 0;

  for (const config of LANDMARK_CONFIGS) {
    const filename = `${config.id}.jpg`;
    const filepath = resolve(OUTPUT_DIR, filename);

    console.log(`[${config.id}]`);

    // Try main title, then alternatives
    const titles = [config.wikiTitle, ...(config.altTitles ?? [])];
    let imageUrl: string | null = null;

    for (const title of titles) {
      imageUrl = await getWikipediaImage(title);
      if (imageUrl) {
        console.log(`  Source: Wikipedia — "${title.replace(/_/g, " ")}"`);
        break;
      }
    }

    if (!imageUrl) {
      console.log(`  SKIP: No image found for any title variant`);
      continue;
    }

    try {
      const buffer = await downloadImage(imageUrl);
      await writeFile(filepath, buffer);
      const sizeKB = (buffer.byteLength / 1024).toFixed(0);
      console.log(`  Saved: ${filename} (${sizeKB} KB)`);
      downloaded++;
    } catch (err) {
      console.error(
        `  ERROR: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    // Brief delay between API calls
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone! ${downloaded}/${LANDMARK_CONFIGS.length} images saved to ${OUTPUT_DIR}`);
  console.log(
    "Grayscale is applied via CSS filter: grayscale(1) in the component.",
  );
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
