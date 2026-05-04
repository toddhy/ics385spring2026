**Code Review Cheat Sheet**

- **Purpose:** Single-page reference for the Week 16 5-minute code review (PRD → Demo → Code walkthrough → Q&A).

**PRD Highlights (0:00–1:00)**
- Open your PRD_v3.pdf. Show cover, problem statement, target segment, and the acceptance-criteria table.
- One-liner evolution: "Weeks 10–16 added data model → server + external APIs → React marketing/dashboard → local + Google auth."

**Live-demo checklist (1:00 demo sequence)**
- Bookmark Render URL; open incognito.
- Sequence to perform (fast):
  1. Marketing page (React marketing page).
  2. Dashboard: show Chart.js visualization and OpenWeatherMap data.
  3. Login: local sign-in or Google Sign-In.
  4. Perform one protected admin action that updates the DB.
  5. Logout.
- Have test user/admin creds visible in a note.

**Code Walk-through (2:00 total)**
- Pick one component (≥15 lines) and explain: intent, inputs, outputs, key logic, error handling.
- Recommended files to choose from:
  - [hawaii-tourism-los-calculator/models/TourismData.js](hawaii-tourism-los-calculator/models/TourismData.js)
  - [week15/term-project/routes/visitor-auth.js](week15/term-project/routes/visitor-auth.js)
  - [hawaii-tourism-los-calculator/routes/api.js](hawaii-tourism-los-calculator/routes/api.js)
  - [week12/hw12a/App.jsx](week12/hw12a/App.jsx)

**Key talking points for each week**
- Wk 10–11 (Data model): schema choices, validation, indexes, embedded vs referenced subdocs.
- Wk 5–9 (Server/API): Express routes, middleware, external API integration (OpenWeatherMap), error handling.
- Wk 12–13 (Frontend): React `useEffect` data fetching, Chart.js integration and data transforms.
- Wk 14–15 (Auth): Passport local + Google flow, verify callback, session/JWT creation, protecting routes.

**Q&A quick responses (two-line answers)**
- Why embedded reviews? — "Embedded reviews keep item+reviews co-located for fast reads; use refs if reviews are large or shared across items."
- How does the dashboard fetch data? — "Client `useEffect` calls Express `/api/dashboard`; server aggregates Mongo + OpenWeatherMap then returns JSON for Chart.js."
- What happens in OAuth callback? — "Server exchanges code, reads profile, finds/creates user in MongoDB, issues session/JWT, redirects."
- How are protected routes enforced? — "Middleware checks `req.isAuthenticated()` or validates the JWT, then proceeds to handler."
- How handle external API failures? — "Try/catch, timeouts, log and show graceful UI fallback; optionally cached data."

**Quick links to open during review**
- PRD (open in PDF viewer)
- [hawaii-tourism-los-calculator/models/TourismData.js](hawaii-tourism-los-calculator/models/TourismData.js)
- [hawaii-tourism-los-calculator/routes/api.js](hawaii-tourism-los-calculator/routes/api.js)
- [week15/term-project/routes/visitor-auth.js](week15/term-project/routes/visitor-auth.js)
- [week12/hw12a/App.jsx](week12/hw12a/App.jsx)

**One-line contingency phrases**
- "I’d investigate by checking server logs, reproducing locally with sample request, and adding unit tests."
- "I prioritized faster reads and simpler transactions for this schema; with bigger scale I’d migrate to referenced documents."

Good luck — want this exported to PDF or a single printable HTML?