/**
 * @module sync-events/utils/rate-limiter
 * Rate-limited fetch wrapper to respect API and scraping limits.
 */

/** Wait for a given number of milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a rate-limited fetch function with a minimum interval between requests.
 * @param intervalMs - Minimum milliseconds between requests.
 * @param label - Label for logging.
 * @returns A fetch function that enforces the rate limit.
 */
export function createRateLimitedFetch(
  intervalMs: number,
  label: string,
): (url: string, init?: RequestInit) => Promise<Response> {
  let lastRequest = 0;

  return async (url: string, init?: RequestInit): Promise<Response> => {
    const now = Date.now();
    const elapsed = now - lastRequest;
    if (elapsed < intervalMs) {
      await sleep(intervalMs - elapsed);
    }
    lastRequest = Date.now();

    const response = await fetch(url, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(15_000),
      headers: {
        "User-Agent": "MoonshotsMagic-EventSync/1.0 (educational project)",
        ...init?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `[${label}] HTTP ${response.status} for ${url}`,
      );
    }

    return response;
  };
}
