#!/usr/bin/env node
/**
 * Add Orlando Tech Summit & Community Awards event to events.json
 */

const fs = require('fs');
const path = require('path');

const eventsPath = path.join(__dirname, '..', 'src', 'data', 'events.json');
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));

const techSummitEvent = {
  id: "manual-orlando-tech-summit-2026",
  title: "Orlando Tech Summit & Community Awards",
  description: "Join founders, investors, corporates, universities, and community partners for an afternoon celebrating Orlando's innovation ecosystem. Features keynote presentations, panel discussions on Orlando's tech economy, startup showcases, capital markets insights, and the inaugural Hall of Fame awards recognizing exceptional technologists and innovation leaders. Includes lunch, expo hall, innovation roundtables, and networking on the rooftop terrace. Presented by Innovate Orlando.",
  category: "tech",
  coordinates: [-81.37681199999997, 28.537695],
  venue: "Dr. Phillips Center for the Performing Arts",
  address: "445 S. Magnolia Avenue",
  city: "Orlando",
  region: "Downtown Orlando",
  startDate: "2026-02-20T17:00:00Z",
  endDate: "2026-02-20T22:30:00Z",
  timezone: "America/New_York",
  url: "https://innovateorlando.org",
  tags: [
    "tech",
    "innovation",
    "summit",
    "awards",
    "networking",
    "startups",
    "venture capital",
    "ecosystem",
    "hall of fame"
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
const existingIndex = eventsData.events.findIndex(e => e.id === techSummitEvent.id);

if (existingIndex >= 0) {
  console.log('Event already exists, updating...');
  eventsData.events[existingIndex] = techSummitEvent;
} else {
  console.log('Adding new event...');
  eventsData.events.unshift(techSummitEvent);
}

// Update lastSynced timestamp
eventsData.lastSynced = new Date().toISOString();

// Write back to file
fs.writeFileSync(eventsPath, JSON.stringify(eventsData, null, 2) + '\n', 'utf8');

console.log(`✅ Orlando Tech Summit & Community Awards added successfully!`);
console.log(`   Event ID: ${techSummitEvent.id}`);
console.log(`   Date: February 20, 2026 12:00 PM - 5:30 PM EST`);
console.log(`   Venue: Dr. Phillips Center for the Performing Arts`);
