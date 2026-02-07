/**
 * @module lib/context/ambient-context
 * Gathers ambient context from browser APIs: time of day, weather (Open-Meteo),
 * and geolocation. Results are cached in localStorage with a 30-minute TTL.
 * Failures never block UI — all fetches use Promise.allSettled.
 */

/** Time-of-day buckets for context-aware UI decisions. */
export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

/** Weather snapshot from Open-Meteo. */
export interface WeatherInfo {
  /** Temperature in Fahrenheit. */
  temp: number;
  /** Human-readable condition (e.g. "Clear", "Rainy"). */
  condition: string;
}

/** Gathered ambient context for personalization. */
export interface AmbientContext {
  /** Coarse time bucket. */
  timeOfDay: TimeOfDay;
  /** Current hour (0-23) for fine-grained logic. */
  hour: number;
  /** Weather data, or null if unavailable. */
  weather: WeatherInfo | null;
  /** User location, or null if denied/unavailable. */
  location: { lat: number; lng: number } | null;
  /** Day name (e.g. "Saturday"). */
  dayOfWeek: string;
  /** Whether today is Saturday or Sunday. */
  isWeekend: boolean;
}

const CACHE_KEY = "moonshots_ambient_context";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes

/** Orlando, FL fallback coordinates. */
const ORLANDO_LAT = 28.5383;
const ORLANDO_LNG = -81.3792;

/**
 * WMO weather code to human-readable condition.
 * @see https://open-meteo.com/en/docs#weathervariables
 */
function wmoToCondition(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code <= 49) return "Foggy";
  if (code <= 59) return "Drizzle";
  if (code <= 69) return "Rainy";
  if (code <= 79) return "Snowy";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code <= 99) return "Thunderstorm";
  return "Unknown";
}

/** Determine time-of-day bucket from current hour. */
function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

/** Attempt to get user location via browser API with a 5-second timeout. */
function getLocation(): Promise<{ lat: number; lng: number } | null> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(null), 5000);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clearTimeout(timeout);
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        clearTimeout(timeout);
        resolve(null);
      },
      { timeout: 5000, maximumAge: CACHE_TTL_MS },
    );
  });
}

/** Fetch weather from Open-Meteo for given coordinates. */
async function fetchWeather(lat: number, lng: number): Promise<WeatherInfo | null> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code&temperature_unit=fahrenheit`;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return null;

    const data = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };

    if (!data.current) return null;
    return {
      temp: Math.round(data.current.temperature_2m ?? 0),
      condition: wmoToCondition(data.current.weather_code ?? 0),
    };
  } catch {
    return null;
  }
}

/** Read cached context from localStorage, returning null if expired or absent. */
function readCache(): AmbientContext | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { context, timestamp } = JSON.parse(raw) as {
      context: AmbientContext;
      timestamp: number;
    };
    if (Date.now() - timestamp > CACHE_TTL_MS) return null;
    return context;
  } catch {
    return null;
  }
}

/** Write context to localStorage with current timestamp. */
function writeCache(context: AmbientContext): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ context, timestamp: Date.now() }),
    );
  } catch {
    // Silently fail — localStorage may be full or disabled
  }
}

/**
 * Gather ambient context from browser APIs.
 * Uses Promise.allSettled so failures never block the UI.
 * Results are cached for 30 minutes.
 *
 * @returns Ambient context with time, weather, location, and day info.
 */
export async function getAmbientContext(): Promise<AmbientContext> {
  const cached = readCache();
  if (cached) return cached;

  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.toLocaleDateString("en-US", { weekday: "long" });
  const dayNum = now.getDay();

  const [locationResult] = await Promise.allSettled([getLocation()]);
  const location =
    locationResult.status === "fulfilled" ? locationResult.value : null;

  const lat = location?.lat ?? ORLANDO_LAT;
  const lng = location?.lng ?? ORLANDO_LNG;

  const [weatherResult] = await Promise.allSettled([fetchWeather(lat, lng)]);
  const weather =
    weatherResult.status === "fulfilled" ? weatherResult.value : null;

  const context: AmbientContext = {
    timeOfDay: getTimeOfDay(hour),
    hour,
    weather,
    location,
    dayOfWeek,
    isWeekend: dayNum === 0 || dayNum === 6,
  };

  writeCache(context);
  return context;
}
