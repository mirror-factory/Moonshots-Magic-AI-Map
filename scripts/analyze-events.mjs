import { readFileSync } from "fs";
const data = JSON.parse(readFileSync("src/data/events.json", "utf-8"));
const events = data.events;
console.log("Total events:", events.length);
console.log("");

const sources = {};
let noUrl = 0, noAddress = 0, noDescription = 0, defaultCoords = 0;
for (const e of events) {
  const src = e.source.type + (e.source.site ? ":" + e.source.site : "");
  sources[src] = (sources[src] || 0) + 1;
  if (!e.url) noUrl++;
  if (!e.address || e.address.trim() === "") noAddress++;
  if (!e.description || e.description.trim() === "") noDescription++;
  if (e.coordinates[0] === -81.3792 && e.coordinates[1] === 28.5383) defaultCoords++;
}

console.log("Events by source:");
Object.entries(sources).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => {
  console.log("  " + s.padEnd(45) + c);
});

console.log("");
console.log("Data quality issues:");
console.log("  Missing URL:", noUrl);
console.log("  Missing address:", noAddress);
console.log("  Missing description:", noDescription);
console.log("  Default coords (downtown fallback):", defaultCoords);

// Show sample events per source for verification
console.log("\n--- Sample events per source ---");
const bySource = {};
for (const e of events) {
  const src = e.source.type;
  if (!bySource[src]) bySource[src] = [];
  if (bySource[src].length < 3) {
    bySource[src].push({
      title: e.title,
      venue: e.venue,
      address: e.address,
      url: e.url || "(none)",
      coords: e.coordinates,
      startDate: e.startDate,
    });
  }
}
for (const [src, samples] of Object.entries(bySource)) {
  console.log(`\n[${src}]`);
  for (const s of samples) {
    console.log(`  "${s.title}"`);
    console.log(`    venue: ${s.venue} | addr: ${s.address}`);
    console.log(`    url: ${s.url}`);
    console.log(`    coords: [${s.coords}] | date: ${s.startDate}`);
  }
}
