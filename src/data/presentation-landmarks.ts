/**
 * @module data/presentation-landmarks
 * Chronological timeline data for the cinematic Orlando presentation mode.
 * Tells the Moonshots & Magic story through real historical moments,
 * each anchored to a place and year on the map.
 */

/** A single moment in the Central Florida timeline. */
export interface PresentationLandmark {
  /** Unique landmark identifier. */
  id: string;
  /** The year this chapter covers. */
  year: string;
  /** Display title for the landmark. */
  title: string;
  /** Subtitle shown below the title. */
  subtitle: string;
  /** Chapter number (1-based). */
  chapter: number;
  /** Narrative paragraph for the panel (read by narrator). */
  narrative: string;
  /** Short TTS-optimized narration script (spoken aloud). */
  narration: string;
  /** Map coordinates [lng, lat]. */
  coordinates: [number, number];
  /** Camera zoom level. */
  zoom: number;
  /** Camera pitch angle in degrees. */
  pitch: number;
  /** Camera bearing for cinematic angle. */
  bearing: number;
  /** Camera animation duration in milliseconds. */
  duration: number;
  /** How long to linger on this landmark (ms) before advancing. */
  lingerDuration: number;
}

/** Chronological timeline telling the Moonshots & Magic story of Central Florida. */
export const PRESENTATION_LANDMARKS: PresentationLandmark[] = [
  {
    id: "fort-gatlin",
    year: "1838",
    title: "Fort Gatlin",
    subtitle: "Where It All Began",
    chapter: 1,
    narrative:
      "Before the rockets and the castles, there was swampland, pine flatwoods, and a small Army outpost called Fort Gatlin. Established in 1838 near present-day Lake Eola, it protected settlers during the Seminole Wars. The tiny settlement that grew around it would eventually be named Orlando — though nobody quite agrees on why.",
    narration:
      "Before the rockets and the castles, there was swampland, and a small Army outpost called Fort Gatlin. Established in eighteen thirty-eight, near present-day Lake Eola, the tiny settlement that grew around it would eventually be named Orlando.",
    coordinates: [-81.3734, 28.5432],
    zoom: 16,
    pitch: 55,
    bearing: -15,
    duration: 3000,
    lingerDuration: 12000,
  },
  {
    id: "citrus-industry",
    year: "1875",
    title: "The Citrus Frontier",
    subtitle: "Orange Groves to the Horizon",
    chapter: 2,
    narrative:
      "By the 1870s, Central Florida had found its first boom: citrus. Miles of orange groves blanketed the rolling hills around Winter Garden and Winter Haven. The railroads arrived, connecting Orlando to the rest of the nation. For nearly a century, Florida's identity was built on sunshine and oranges — a golden era that set the stage for everything that followed.",
    narration:
      "By the eighteen seventies, Central Florida found its first boom. Citrus. Miles of orange groves blanketed the rolling hills. The railroads arrived, and for nearly a century, Florida's identity was built on sunshine and oranges.",
    coordinates: [-81.5862, 28.5653],
    zoom: 14,
    pitch: 45,
    bearing: 20,
    duration: 3500,
    lingerDuration: 11000,
  },
  {
    id: "cape-canaveral-origins",
    year: "1950",
    title: "Cape Canaveral",
    subtitle: "The Launchpad Takes Shape",
    chapter: 3,
    narrative:
      "In 1950, the U.S. government selected Cape Canaveral as its missile testing range — a remote stretch of Atlantic coast, far from population centers, where rockets could fly east over open ocean. The first launch, a modified V-2 called Bumper 8, rose from the pad on July 24th, 1950. The Space Coast was born.",
    narration:
      "In nineteen fifty, the government selected Cape Canaveral as its missile testing range — a remote stretch of Atlantic coast where rockets could fly east over open ocean. The Space Coast was born.",
    coordinates: [-80.5772, 28.4889],
    zoom: 14.5,
    pitch: 50,
    bearing: 45,
    duration: 4000,
    lingerDuration: 11000,
  },
  {
    id: "mercury-program",
    year: "1961",
    title: "Kennedy Space Center",
    subtitle: "The Moonshot Speech",
    chapter: 4,
    narrative:
      "On May 25th, 1961, President Kennedy stood before Congress and declared that America would land a man on the Moon before the decade was out. It was audacious. It was improbable. It was, in every sense of the word, a moonshot. Cape Canaveral transformed overnight into the nerve center of humanity's greatest engineering challenge.",
    narration:
      "On May twenty-fifth, nineteen sixty-one, President Kennedy declared that America would land a man on the Moon before the decade was out. It was audacious. It was improbable. It was a moonshot. Cape Canaveral became the nerve center of humanity's greatest engineering challenge.",
    coordinates: [-80.6041, 28.5728],
    zoom: 15,
    pitch: 55,
    bearing: 30,
    duration: 3500,
    lingerDuration: 13000,
  },
  {
    id: "apollo-11",
    year: "1969",
    title: "Launch Complex 39A",
    subtitle: "One Giant Leap",
    chapter: 5,
    narrative:
      "July 16th, 1969. Saturn V rumbled to life on Pad 39A, carrying Armstrong, Aldrin, and Collins toward the Moon. Four days later, six hundred million people watched as a human being stepped onto another world. The moonshot had landed. Central Florida had delivered the impossible — and proved that the boldest dreams aren't just worth having, they're worth building.",
    narration:
      "July sixteenth, nineteen sixty-nine. Saturn Five rumbled to life, carrying Armstrong, Aldrin, and Collins toward the Moon. Four days later, six hundred million people watched a human step onto another world. The moonshot had landed.",
    coordinates: [-80.6043, 28.6083],
    zoom: 16,
    pitch: 60,
    bearing: -20,
    duration: 3000,
    lingerDuration: 13000,
  },
  {
    id: "disney-world",
    year: "1971",
    title: "Walt Disney World",
    subtitle: "The Magic Kingdom Opens",
    chapter: 6,
    narrative:
      "Just two years after Apollo 11, another impossible vision materialized — this time in the swamplands southwest of Orlando. Walt Disney had secretly purchased 27,000 acres, twice the size of Manhattan, to build what he called the Florida Project. He didn't live to see it open, but on October 1st, 1971, the Magic Kingdom welcomed its first guests. A castle rose from the wetlands, and with it, an entire philosophy: that wonder is engineered, not accidental.",
    narration:
      "Two years after Apollo eleven, another impossible vision materialized in the swamplands southwest of Orlando. Walt Disney had secretly purchased twenty-seven thousand acres to build the Florida Project. On October first, nineteen seventy-one, the Magic Kingdom opened. That's the magic half of our name — the belief that wonder is engineered, not accidental.",
    coordinates: [-81.5639, 28.4177],
    zoom: 15.5,
    pitch: 60,
    bearing: -45,
    duration: 3500,
    lingerDuration: 14000,
  },
  {
    id: "epcot",
    year: "1982",
    title: "EPCOT Center",
    subtitle: "The City of Tomorrow",
    chapter: 7,
    narrative:
      "Walt's original vision for EPCOT wasn't a theme park — it was an Experimental Prototype Community of Tomorrow, a living city where twenty thousand people would test emerging technologies. The park that opened in 1982 was a compromise, but it carried the spirit forward: a celebration of human innovation and global culture, ringed by the World Showcase's eleven nations. Moonshots and magic, fused into a single address.",
    narration:
      "Walt's original vision for EPCOT wasn't a theme park. It was an Experimental Prototype Community of Tomorrow. The park that opened in nineteen eighty-two carried that spirit forward — a celebration of human innovation and global culture. Moonshots and magic, fused into a single address.",
    coordinates: [-81.5494, 28.3747],
    zoom: 16,
    pitch: 55,
    bearing: 15,
    duration: 3000,
    lingerDuration: 12000,
  },
  {
    id: "universal-studios",
    year: "1990",
    title: "Universal Studios Florida",
    subtitle: "Stories Come Alive",
    chapter: 8,
    narrative:
      "Universal arrived in 1990 and pushed the frontier further — blurring the line between audience and story. Then came Islands of Adventure, the Wizarding World of Harry Potter, and eventually Epic Universe. Orlando didn't just host entertainment anymore. It redefined it. Every ride became a narrative. Every queue, a world being built around you.",
    narration:
      "Universal arrived in nineteen ninety and pushed the frontier further, blurring the line between audience and story. Then came Islands of Adventure, the Wizarding World, and Epic Universe. Orlando didn't just host entertainment. It redefined it.",
    coordinates: [-81.4684, 28.4747],
    zoom: 15.5,
    pitch: 55,
    bearing: -10,
    duration: 3000,
    lingerDuration: 11000,
  },
  {
    id: "space-shuttle",
    year: "2011",
    title: "Space Coast",
    subtitle: "Shuttle's Final Flight",
    chapter: 9,
    narrative:
      "On July 21st, 2011, Space Shuttle Atlantis touched down for the last time, ending the thirty-year Shuttle program. For a moment, the launchpads went quiet. But the Space Coast was not done. SpaceX moved into Pad 39A — the same pad that launched Apollo 11 — and a new era of commercial spaceflight began. The moonshots kept coming.",
    narration:
      "In twenty-eleven, Space Shuttle Atlantis touched down for the last time. The launchpads went quiet. But not for long. SpaceX moved into Pad thirty-nine A, the same pad that launched Apollo eleven, and a new era of commercial spaceflight began. The moonshots kept coming.",
    coordinates: [-80.6043, 28.6083],
    zoom: 15.5,
    pitch: 55,
    bearing: 60,
    duration: 3500,
    lingerDuration: 12000,
  },
  {
    id: "creative-village",
    year: "2020s",
    title: "Creative Village & Downtown",
    subtitle: "The Innovation Core",
    chapter: 10,
    narrative:
      "Today, downtown Orlando pulses with a different kind of energy. Creative Village, UCF's downtown campus, and a growing tech corridor are rewriting the region's identity. Orlando is no longer just a tourism capital — it's becoming a hub for simulation, gaming, defense tech, and the creative industries. The same spirit that launched rockets and built castles now drives startups, studios, and makers.",
    narration:
      "Today, downtown Orlando pulses with a different kind of energy. Creative Village, UCF's downtown campus, and a growing tech corridor are rewriting the region's identity. The same spirit that launched rockets and built castles now drives startups, studios, and makers.",
    coordinates: [-81.3792, 28.5415],
    zoom: 16,
    pitch: 55,
    bearing: -30,
    duration: 3000,
    lingerDuration: 11000,
  },
  {
    id: "orlando-today",
    year: "Now",
    title: "Central Florida",
    subtitle: "Moonshots & Magic",
    chapter: 11,
    narrative:
      "Zoom out, and the full picture emerges. A region that launches rockets and builds castles. That marries ambition with wonder. From Fort Gatlin to Artemis, from a swamp outpost to a global destination — Central Florida's story is one of relentless, improbable transformation. Moonshots and Magic isn't just our name. It's the DNA of this place. And this map is your guide to everything happening in it, right now.",
    narration:
      "Zoom out, and the full picture emerges. A region that launches rockets and builds castles. That marries ambition with wonder. Moonshots and Magic isn't just a name. It's the DNA of Central Florida. And this map is your guide to everything happening in it, right now.",
    coordinates: [-81.2, 28.5],
    zoom: 10.5,
    pitch: 0,
    bearing: 0,
    duration: 4000,
    lingerDuration: 12000,
  },
];
