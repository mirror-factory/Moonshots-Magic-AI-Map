/**
 * @module scripts/generate-presentation-audio
 * Pre-generates Cartesia TTS audio for all presentation chapters.
 * Saves WAV files to public/audio/presentation/ for instant playback.
 *
 * Usage: npx tsx scripts/generate-presentation-audio.ts
 */

import { readFileSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CARTESIA_API_URL = "https://api.cartesia.ai/tts/bytes";
const DEFAULT_VOICE_ID = "b7d50908-b17c-442d-ad8d-810c63997ed9";
const OUTPUT_DIR = resolve(__dirname, "../public/audio/presentation");

// Load env from .env.local
function loadEnv(): string {
  const envPath = resolve(__dirname, "../.env.local");
  const envContent = readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) {
      const [, key, value] = match;
      process.env[key.trim()] = value.trim();
    }
  }
  const key = process.env.NEXT_PUBLIC_CARTESIA_API_KEY;
  if (!key) throw new Error("NEXT_PUBLIC_CARTESIA_API_KEY not found in .env.local");
  return key;
}

// Import landmarks (using dynamic import for TS)
interface Landmark {
  id: string;
  year: string;
  title: string;
  narration: string;
}

async function loadLandmarks(): Promise<Landmark[]> {
  // Read the TS file and extract data manually since we can't import TS directly
  const filePath = resolve(__dirname, "../src/data/presentation-landmarks.ts");
  const content = readFileSync(filePath, "utf-8");

  // Extract each landmark object
  const landmarks: Landmark[] = [];
  const regex = /\{\s*id:\s*"([^"]+)"[\s\S]*?year:\s*"([^"]+)"[\s\S]*?title:\s*"([^"]+)"[\s\S]*?narration:\s*\n\s*"([\s\S]*?)"(?:,\s*\n|\s*\n)/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    landmarks.push({
      id: match[1],
      year: match[2],
      title: match[3],
      narration: match[4].replace(/\\n/g, "\n"),
    });
  }

  if (landmarks.length === 0) {
    throw new Error("Failed to parse landmarks from presentation-landmarks.ts");
  }

  return landmarks;
}

async function generateAudio(
  text: string,
  apiKey: string,
  voiceId: string = DEFAULT_VOICE_ID,
): Promise<ArrayBuffer> {
  const response = await fetch(CARTESIA_API_URL, {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
      "Cartesia-Version": "2024-11-13",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: "sonic-2",
      transcript: text,
      voice: { mode: "id", id: voiceId },
      output_format: {
        container: "wav",
        encoding: "pcm_s16le",
        sample_rate: 24000,
      },
      language: "en",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Cartesia API error ${response.status}: ${errorText}`);
  }

  return response.arrayBuffer();
}

async function main() {
  console.log("Loading API key...");
  const apiKey = loadEnv();
  console.log(`API key loaded (${apiKey.substring(0, 8)}...)`);

  console.log("Loading landmarks...");
  const landmarks = await loadLandmarks();
  console.log(`Found ${landmarks.length} landmarks`);

  await mkdir(OUTPUT_DIR, { recursive: true });

  for (const landmark of landmarks) {
    const filename = `${landmark.id}.wav`;
    const filepath = resolve(OUTPUT_DIR, filename);

    console.log(`\nGenerating: ${landmark.year} — ${landmark.title}`);
    console.log(`  Text: "${landmark.narration.substring(0, 60)}..."`);

    const startTime = Date.now();
    const buffer = await generateAudio(landmark.narration, apiKey);
    const elapsed = Date.now() - startTime;

    await writeFile(filepath, Buffer.from(buffer));
    const sizeMB = (buffer.byteLength / 1024 / 1024).toFixed(2);
    console.log(`  Saved: ${filename} (${sizeMB} MB, ${elapsed}ms)`);

    // Rate limit — 500ms between requests
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\nDone! ${landmarks.length} audio files saved to ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
