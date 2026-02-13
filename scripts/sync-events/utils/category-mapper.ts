/**
 * @module sync-events/utils/category-mapper
 * Maps external source categories to our EventCategory values.
 */

import type { EventCategory } from "../../../src/lib/registries/types";

/** Map Ticketmaster segment names to EventCategory. */
const TM_SEGMENT_MAP: Record<string, EventCategory> = {
  Music: "music",
  Sports: "sports",
  "Arts & Theatre": "arts",
  Film: "arts",
  Miscellaneous: "other",
};

/** Map Ticketmaster genre names to EventCategory (overrides segment). */
const TM_GENRE_MAP: Record<string, EventCategory> = {
  Comedy: "nightlife",
  "Children's Theatre": "family",
  "Children's Music": "family",
  Circus: "family",
  Magic: "family",
  Dance: "arts",
  Opera: "arts",
  Classical: "arts",
  Jazz: "music",
  "R&B": "music",
  Pop: "music",
  Rock: "music",
  Country: "music",
  "Hip-Hop/Rap": "music",
  Electronic: "nightlife",
  Folk: "music",
  Latin: "music",
  "World Music": "music",
  Basketball: "sports",
  Football: "sports",
  Baseball: "sports",
  Soccer: "sports",
  Hockey: "sports",
  Tennis: "sports",
  Golf: "sports",
  "Martial Arts": "sports",
  Wrestling: "sports",
  Boxing: "sports",
  Equestrian: "outdoor",
  "Motor Sports": "sports",
  Festival: "festival",
  "Food & Drink": "food",
  Fairs: "festival",
  "Community/Civic": "community",
  "Community/Social": "community",
  Family: "family",
  Hobby: "community",
  "Ice Shows": "family",
};

/**
 * Map a Ticketmaster event to an EventCategory using segment + genre.
 * @param segmentName - Ticketmaster segment name.
 * @param genreName - Ticketmaster genre name.
 * @returns Mapped EventCategory.
 */
export function mapTicketmasterCategory(
  segmentName?: string,
  genreName?: string,
): EventCategory {
  if (genreName && TM_GENRE_MAP[genreName]) {
    return TM_GENRE_MAP[genreName];
  }
  if (segmentName && TM_SEGMENT_MAP[segmentName]) {
    return TM_SEGMENT_MAP[segmentName];
  }
  return "other";
}

/** Keyword patterns for scraper-based category inference. */
const KEYWORD_PATTERNS: Array<[RegExp, EventCategory]> = [
  [/\b(concert|band|dj|live music|singer|songwriter|orchestra|symphony|jazz|blues|rock|hip[- ]?hop|rap|edm|karaoke)\b/i, "music"],
  [/\b(gallery|exhibit|museum|art walk|paint|sculpture|theater|theatre|ballet|opera|dance performance|poetry|spoken word)\b/i, "arts"],
  [/\b(game|match|tournament|championship|soccer|football|basketball|baseball|tennis|golf|wrestling|boxing|mma|racing)\b/i, "sports"],
  [/\b(food truck|tasting|brunch|dinner|cooking class|wine|beer|brewery|cocktail|chef|culinary|bbq|barbecue|foodie)\b/i, "food"],
  [/\b(tech|hackathon|coding|developer|startup|ai\b|machine learning|cyber|software|web3|blockchain)\b/i, "tech"],
  [/\b(kids|children|family|toddler|puppet|storytime|story time|bounce house|petting zoo|easter egg|trick or treat)\b/i, "family"],
  [/\b(bar crawl|club|nightclub|drag|burlesque|happy hour|comedy show|comedy night|stand[- ]?up|open mic|late night)\b/i, "nightlife"],
  [/\b(hike|kayak|paddle|bike|cycling|run\b|running|5k|10k|marathon|trail|nature|park|garden|outdoor|camping|fishing|surf)\b/i, "outdoor"],
  [/\b(workshop|class|seminar|lecture|panel|webinar|conference|summit|training|education|learn|course|certification)\b/i, "education"],
  [/\b(festival|fest\b|carnival|fiesta|celebration|block party|parade|fireworks|gala)\b/i, "festival"],
  [/\b(market|farmer|flea|craft fair|vendor|artisan|swap meet|bazaar|pop[- ]?up shop)\b/i, "market"],
  [/\b(volunteer|cleanup|fundrais|charity|nonprofit|community meeting|town hall|civic|neighborhood)\b/i, "community"],
];

/**
 * Infer an EventCategory from text content using keyword patterns.
 * @param text - Combined text from title, category, description.
 * @returns Inferred category, or "other" if no match.
 */
export function inferCategoryFromText(text: string): EventCategory {
  for (const [pattern, category] of KEYWORD_PATTERNS) {
    if (pattern.test(text)) {
      return category;
    }
  }
  return "other";
}
