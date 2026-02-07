# Eventbrite Integration Setup

## 1. Create an Eventbrite Account

1. Go to [eventbrite.com](https://www.eventbrite.com)
2. Sign up or log in

## 2. Get API Credentials

1. Go to [Eventbrite API Keys](https://www.eventbrite.com/platform/api-keys)
2. Create a new API key (or use an existing one)
3. Copy the **Private token** (this is your API key)

## 3. Configure Environment

Add to `.env.local`:

```
EVENTBRITE_API_KEY=your_private_token_here
```

## 4. API Endpoints Used

| Endpoint | Purpose |
|----------|---------|
| `GET /v3/events/search/` | Search events by location/query |
| `GET /v3/events/{id}/` | Get event details |
| `GET /v3/categories/` | List all categories |

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
- The search endpoint returns paginated results (50 per page)

## 7. Testing

Without an API key, the endpoint returns a 503 with a helpful message:

```bash
curl http://localhost:3000/api/eventbrite/search?lat=28.5383&lng=-81.3792
# Returns: { "error": "Eventbrite API key not configured", ... }
```

With an API key:

```bash
curl "http://localhost:3000/api/eventbrite/search?lat=28.5383&lng=-81.3792&q=music"
```
