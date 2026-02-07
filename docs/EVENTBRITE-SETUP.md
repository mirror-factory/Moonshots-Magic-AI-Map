# Eventbrite Integration Setup

## 1. Create an Eventbrite Account

1. Go to [eventbrite.com](https://www.eventbrite.com)
2. Sign up or log in

## 2. Get API Credentials

1. Go to [Eventbrite API Keys](https://www.eventbrite.com/platform/api-keys)
2. Create a new API key (or use an existing one)
3. Copy the **Private Token** (the long OAuth token, NOT the short "API Key" ID)

**IMPORTANT:** The "API Key" shown in the dashboard is a short identifier (e.g., `IDQRH6N...`). This is NOT what you need for API calls. You need the **Private Token** which is the longer OAuth token used as a Bearer token in API requests.

## 3. Configure Environment

Add to `.env.local`:

```
EVENTBRITE_PRIVATE_TOKEN=your_oauth_private_token_here
```

## 4. API Endpoints Used

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `GET /v3/destination/search/` | Search events by location (current) | Active |
| `GET /v3/events/search/` | Legacy search by location/query | Deprecated |
| `GET /v3/events/{id}/` | Get event details | Active |
| `GET /v3/users/me/` | Verify token | Active |

**Note:** The `/v3/events/search/` endpoint was deprecated by Eventbrite. Our route tries `/v3/destination/search/` first and falls back to the legacy endpoint.

## 5. Category Mapping

| Eventbrite ID | Eventbrite Name | Our Category |
|---------------|-----------------|-------------|
| 103 | Music | music |
| 105 | Performing & Visual Arts | arts |
| 108 | Sports & Fitness | sports |
| 110 | Food & Drink | food |
| 102 | Science & Technology | tech |
| 113 | Community & Culture | community |
| 115 | Family & Education | family |
| 111 | Nightlife | nightlife |
| 109 | Travel & Outdoor | outdoor |
| 107 | Health & Wellness | education |
| 106 | Fashion & Beauty | festival |
| 114 | Religion & Spirituality | community |

## 6. Rate Limits

- **1000 requests per hour** with a valid API key
- Responses are cached for 5 minutes on our side
- The search endpoint returns paginated results (20 per page)

## 7. Troubleshooting

**"Eventbrite authentication failed" (401):**
You're using the API Key ID instead of the Private Token. Go to your [API Keys page](https://www.eventbrite.com/platform/api-keys) and copy the actual Private Token (OAuth token), not the short key ID.

**"Eventbrite API token not configured" (503):**
Add `EVENTBRITE_PRIVATE_TOKEN=...` to your `.env.local` file and restart the dev server.

**404 on search:**
The legacy search endpoint is deprecated. The route now tries the destination search endpoint first.

## 8. Testing

Without a token, the endpoint returns a 503 with a helpful message:

```bash
curl http://localhost:3000/api/eventbrite/search?lat=28.5383&lng=-81.3792
# Returns: { "error": "Eventbrite API token not configured", ... }
```

With a valid OAuth private token:

```bash
curl "http://localhost:3000/api/eventbrite/search?lat=28.5383&lng=-81.3792&q=music"
```
