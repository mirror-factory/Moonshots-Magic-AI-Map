/**
 * @module components/chat/ditto-personality
 * Generates contextual greetings and personality text for the AI assistant.
 * Uses ambient context (time, weather, day) to create warm, relevant greetings.
 */

import type { AmbientContext } from "@/lib/context/ambient-context";

/** Greeting templates keyed by time of day. */
const TIME_GREETINGS: Record<string, string[]> = {
  morning: [
    "Good morning{name}! Ready to explore?",
    "Rise and shine{name}! What adventure awaits today?",
    "Morning{name}! Let's find something amazing today.",
  ],
  afternoon: [
    "Good afternoon{name}! The city's alive with events.",
    "Hey{name}! Perfect time to discover something new.",
    "Afternoon{name}! What sounds fun right now?",
  ],
  evening: [
    "Good evening{name}! The city's buzzing tonight.",
    "Evening{name}! Ready for a night out?",
    "Hey{name}! Great time to find tonight's plans.",
  ],
  night: [
    "Hey night owl{name}! Still up for something?",
    "Late night{name}? Let's find what's still going.",
    "Burning the midnight oil{name}? I've got ideas.",
  ],
};

/** Weather-aware additions. */
const WEATHER_ADDITIONS: Record<string, string[]> = {
  Clear: [
    "Beautiful weather out there!",
    "Perfect skies for exploring.",
    "Clear skies — great for outdoor events!",
  ],
  "Partly cloudy": [
    "Nice weather for getting out.",
    "Clouds keeping it comfortable today.",
  ],
  Rainy: [
    "Rainy day? Let me find something cozy indoors.",
    "Perfect weather for indoor events!",
    "Rain outside — let's find indoor fun.",
  ],
  Drizzle: [
    "A little drizzle won't stop the fun!",
    "Light rain — how about something indoors?",
  ],
  Thunderstorm: [
    "Stormy out there — let's find indoor options!",
    "Thunder and lightning! Time for indoor adventures.",
  ],
  Foggy: [
    "Mysterious fog today — let's discover something!",
  ],
  Showers: [
    "Showers rolling through — indoor plans it is!",
    "Rainy vibes? I've got cozy picks.",
  ],
};

/** Weekend-specific additions. */
const WEEKEND_ADDITIONS = [
  "Happy weekend!",
  "Weekend vibes — so many options!",
  "It's the weekend — time to have fun!",
];

/** Pick a random item from an array. */
function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a contextual greeting based on ambient context.
 *
 * @param context - Current ambient context (time, weather, location, day).
 * @param name - Optional user name for personalization.
 * @returns A friendly, context-aware greeting string.
 */
export function getDittoGreeting(context: AmbientContext | null, name?: string): string {
  if (!context) {
    const namePart = name ? `, ${name}` : "";
    return `Hey${namePart}! What are you in the mood for?`;
  }

  const namePart = name ? `, ${name}` : "";
  const timeGreetings = TIME_GREETINGS[context.timeOfDay] ?? TIME_GREETINGS.afternoon;
  let greeting = pickRandom(timeGreetings).replace("{name}", namePart);

  // Add weather context if available
  if (context.weather) {
    const weatherKey = context.weather.condition;
    const additions = WEATHER_ADDITIONS[weatherKey];
    if (additions) {
      greeting += ` ${pickRandom(additions)}`;
    } else if (context.weather.temp > 85) {
      greeting += " It's hot out — maybe something with AC?";
    } else if (context.weather.temp < 50) {
      greeting += " Chilly today — let's find something warm.";
    }
  }

  // Add weekend flair
  if (context.isWeekend && Math.random() > 0.5) {
    greeting += ` ${pickRandom(WEEKEND_ADDITIONS)}`;
  }

  return greeting;
}

/**
 * Generate a short contextual subtitle for suggestion tiles.
 *
 * @param context - Current ambient context.
 * @returns A brief contextual hint (e.g. "Warm evening — perfect for exploring").
 */
export function getContextualSubtitle(context: AmbientContext | null): string {
  if (!context) return "Discover Orlando's best events";

  const { timeOfDay, weather, isWeekend } = context;
  const parts: string[] = [];

  if (weather) {
    parts.push(`${weather.temp}°F, ${weather.condition.toLowerCase()}`);
  }

  if (isWeekend) {
    parts.push("weekend");
  } else {
    parts.push(timeOfDay);
  }

  return parts.length > 0
    ? `${parts.join(" · ")} — let's find something great`
    : "Discover Orlando's best events";
}
