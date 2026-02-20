#!/usr/bin/env node
/**
 * Add Joybreak × IMMERSE Art Crawl event to events.json
 */

const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, '..', 'src', 'data', 'events.json');
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

const joybreakEvent = {
  id: "manual-joybreak-immerse-2026",
  title: "Joybreak × IMMERSE: An Art Crawl Through Downtown Orlando",
  description: "Join us for a Joybreak Art Crawl through IMMERSE Festival, a city-wide celebration of interactive art, immersive experiences, and creative technology lighting up Downtown Orlando. We'll meet at the Dr. Phillips Center at 6PM, then make our way through the festival together, stopping to explore installations at OtherVRse before closing out the night at Assemblage's house party at 8PM. This is the after-party to the Orlando Tech Summit. Come curious, come social, and come ready to wander. In partnership with Innovate Orlando.",
  category: "arts",
  coordinates: [-81.37681199999997, 28.537695],
  venue: "Dr. Phillips Center for the Performing Arts",
  address: "445 S Magnolia Ave",
  city: "Orlando",
  region: "Downtown Orlando",
  startDate: "2026-02-20T23:00:00Z",
  endDate: "2026-02-21T03:00:00Z",
  timezone: "America/New_York",
  url: "https://luma.com/iojvapmq",
  tags: [
    "art",
    "immersive",
    "festival",
    "crawl",
    "networking",
    "interactive art",
    "creative technology",
    "IMMERSE",
    "downtown"
  ],
  source: {
    type: "manual",
    addedBy: "admin"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "active",
  featured: true
};

// Check if event already exists
const existingIndex = eventsData.events.findIndex(e => e.id === joybreakEvent.id);

if (existingIndex >= 0) {
  console.log('Event already exists, updating...');
  eventsData.events[existingIndex] = joybreakEvent;
} else {
  console.log('Adding new event...');
  eventsData.events.unshift(joybreakEvent);
}

// Update lastSynced timestamp
eventsData.lastSynced = new Date().toISOString();

// Write back to file
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2) + '\n', 'utf8');

console.log(`✅ Joybreak × IMMERSE Art Crawl added successfully!`);
console.log(`   Event ID: ${joybreakEvent.id}`);
console.log(`   Date: February 20, 2026 6:00 PM - 10:00 PM EST`);
console.log(`   Venue: Dr. Phillips Center for the Performing Arts`);
console.log(`   URL: https://luma.com/iojvapmq`);
