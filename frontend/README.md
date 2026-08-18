# Wildlife Population Intelligence System — Frontend

React (Vite) frontend for the WPIS biodiversity monitoring platform. Every screen
renders from mock data, so the app is fully usable before the FastAPI backend exists.

## Run it

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. On the login screen, click any demo account and use any
password of 4+ characters — each one opens a different role dashboard.

| Role | Email |
| --- | --- |
| Wildlife Researcher | anitha@wildlife.org |
| Conservation Officer | karthik@conserve.in |
| Forest Department Officer | selvaraj@tnforest.gov.in |
| Administrator | priya@wildlife.org |

## Switching to the real API

Mock mode is a single flag. In `.env`:

```
VITE_API_URL=https://your-fastapi-host/api/v1
VITE_USE_MOCK=false
```

Every service in `src/services/` is written as:

```js
if (USE_MOCK) return respond(mockData);
const { data } = await api.get('/endpoint');
return data;
```

Delete the mock branch once an endpoint is live — no page or component changes needed.
The axios instance in `src/services/api.js` attaches the JWT from localStorage,
normalises error messages, and redirects to `/login` on a 401.

### Endpoints the services expect

| Service | Method | Endpoint |
| --- | --- | --- |
| authService | POST | `/auth/login`, `/auth/register` |
| authService | PATCH | `/auth/me` |
| siteService | GET/POST/DELETE | `/monitoring/sites` |
| imageService | GET | `/images`, `/images/{id}` |
| imageService | POST | `/images/upload` (multipart) |
| audioService | GET | `/bioacoustics/recordings` |
| audioService | POST | `/bioacoustics/upload` (multipart) |
| speciesService | GET | `/species` |
| analyticsService | GET | `/analytics/population` |
| habitatService | GET | `/biodiversity/overview` |
| healthService | GET | `/health/ecosystem` |
| conservationService | GET/POST | `/conservation/recommendations` |
| alertService | GET/PATCH/POST | `/alerts` |
| reportService | GET | `/reports`, `/reports/export/{pdf\|xlsx}` |
| adminService | GET/PATCH | `/admin/overview`, `/admin/users` |
| dashboardService | GET | `/dashboard?role=` |

## Notes on a few decisions

**Camera trap frames.** `TrapFrame.jsx` draws a synthetic 4:3 capture in SVG rather
than loading a placeholder photo, so bounding-box percentages, the IR/daylight
treatment and the burnt-in timestamp strip all behave exactly as they will against
real JPEGs. When the API returns `image.url`, swap the `<svg>` for an `<img>` — the
overlay layer needs no changes.

**IUCN colours are not decorative.** `IucnBadge` uses the official Red List category
palette (LC `#60C659` through CR `#D81E05`), and the same colours stroke the bounding
boxes. A researcher reads threat status from the box colour without a legend.

**The health score is recomputed client-side.** `computeWeightedScore()` in
`healthService.js` applies the 30/25/20/15/10 weights to the component scores, so the
gauge can never disagree with the bars beneath it, even if the API sends a stale total.

**No browser storage in artifacts except auth.** Only the JWT and the cached user
object live in localStorage, under the `wpis_` prefix.

## Accessibility & responsiveness

Sidebar collapses to a drawer under `lg`. Tables scroll horizontally rather than
wrapping. Modals trap Escape and lock body scroll. Focus rings are visible on every
interactive element, and `prefers-reduced-motion` disables all transitions.
