# DecepShield AI — User Acceptance Testing (UAT) Checklist

**Purpose:** a concrete, step-by-step script a mentor, peer, or the developer
can run against the live dashboard (local or deployed) to confirm each major
feature works as intended before sign-off.

**How to use:** work through each section top to bottom. Record Pass/Fail and
notes in the right-hand columns. A section is "Passed" only if every step in
it passes.

**Environment under test:** [ ] Local (localhost:5173 + localhost:3001)  [ ] Deployed (Vercel + Render)

**Tester name:** _______________  **Date:** _______________

---

## 1. Authentication

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 1.1 | Go to the login page while logged out | Login form loads, no console errors | | |
| 1.2 | Register a new account with a valid email + password | Account is created, redirected into the dashboard | | |
| 1.3 | Register again with the same email | Clear error shown ("user already exists"), no crash | | |
| 1.4 | Log out, then log back in with correct credentials | Returns to dashboard, session persists on refresh | | |
| 1.5 | Attempt login with a wrong password | Clear error, no token issued | | |
| 1.6 | Click "Sign in with Google" (if configured) | Redirects to Google, back to dashboard on success | | |
| 1.7 | Click "Sign in with GitHub" (if configured) | Redirects to GitHub, back to dashboard on success | | |
| 1.8 | Click "Sign in with Discord" (if configured) | Redirects to Discord, back to dashboard on success | | |
| 1.9 | Log out, then try to open /dashboard directly via URL | Redirected to login (protected route works) | | |
| 1.10 | Try an API call with an expired/invalid token (e.g. edit localStorage token) | API returns 401, frontend handles it gracefully (redirect to login, not a blank screen) | | |

## 2. Dashboard (overview)

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 2.1 | Load the Dashboard page | Stat cards (active attackers, total incidents, etc.) render without errors | | |
| 2.2 | Check stats reflect real data | Numbers match what's actually in MongoDB (spot-check one) | | |
| 2.3 | Trigger a "Simulate Attack" (or wait for a real honeypot hit) | A new incident appears on the dashboard in real time, no manual refresh needed (Socket.io) | | |
| 2.4 | Check charts (Recharts) render | No blank/broken chart areas, tooltips work on hover | | |
| 2.5 | Resize browser window / test on a smaller screen | Layout stays usable (no overlapping elements) | | |

## 3. Honeypot Management

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 3.1 | Open the Honeypots page | List of configured honeypots (SSH/FTP/HTTP/MySQL/Redis) loads | | |
| 3.2 | Deploy/start a honeypot listener | Status changes to "Running", port shown correctly | | |
| 3.3 | Connect to that honeypot's port locally (e.g. nc localhost <port> or ssh -p <port> localhost) | Connection is accepted by the honeypot, not refused | | |
| 3.4 | Check that connection attempt shows up as an incident | New incident logged with correct honeypot type/port | | |
| 3.5 | Stop a running honeypot | Status changes to "Stopped", port no longer accepts connections | | |
| 3.6 | (Deployed only) Confirm awareness that honeypot TCP ports are not internet-reachable on Render free tier | Documented limitation, not a bug — see DEPLOYMENT.md | | |

## 4. Live Monitor

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 4.1 | Open Live Monitor with a second browser tab open on Dashboard | Both tabs receive the same real-time incident via Socket.io | | |
| 4.2 | Trigger multiple incidents in quick succession | All appear in order, none dropped, no duplicate entries | | |
| 4.3 | Leave the tab open for 5+ minutes idle | Socket connection stays alive (check Network tab — no repeated reconnect storms) | | |

## 5. AI Threat Intelligence

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 5.1 | Generate a new incident and wait up to ~30s (the AI engine's poll interval) | Incident gets an AI-generated classification (MITRE ATT&CK technique, severity, summary) | | |
| 5.2 | Open the AI Threat Intel page | Classified incidents list with technique IDs/names, filterable | | |
| 5.3 | Check a classification against the raw incident payload (spot-check) | Classification is plausible given the actual attack data (not generic/wrong) | | |
| 5.4 | Temporarily use an invalid GEMINI_API_KEY (test env only) | Engine fails gracefully (logs an error, doesn't crash the server or block other features) | | |

## 6. Attacker Journey / Session Analysis

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 6.1 | Open Attacker Journey for an attacker with multiple incidents | Timeline/journey view renders showing sequence of actions | | |
| 6.2 | Open Session Analysis for a specific session | Session details, duration, and related incidents display correctly | | |

## 7. Evidence

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 7.1 | Open the Evidence page | Captured evidence (payloads, logs, etc.) for incidents is listed | | |
| 7.2 | Open evidence detail for one incident | Full evidence content displays without truncation/corruption | | |

## 8. Reports

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 8.1 | Open the Reports page | Report generation UI loads | | |
| 8.2 | Generate a report for a date range with data | Report is produced (PDF/export) with correct incident counts | | |
| 8.3 | Generate a report for a date range with no data | Handled gracefully (empty state, not a crash) | | |
| 8.4 | Download the generated report | File downloads and opens correctly | | |

## 9. Settings

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 9.1 | Open Settings | User's account settings load correctly | | |
| 9.2 | Change a setting (e.g. notification preference, if present) and save | Change persists after page refresh | | |
| 9.3 | Regenerate/view API key or ingest key (if exposed in UI) | Key displays/regenerates correctly, old key invalidated if regenerated | | |

## 10. Security & Access Control

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 10.1 | Call a protected API route (e.g. GET /api/stats) with no Authorization header | 401 Unauthorized | | |
| 10.2 | Call POST /api/incidents with a valid x-ingest-key header but no JWT | Request succeeds (honeypot ingestion path works without login) | | |
| 10.3 | Call POST /api/incidents with neither a valid ingest key nor a JWT | 401 Unauthorized (endpoint is not open to the public) | | |
| 10.4 | Attempt registration with a weak/malformed input (e.g. invalid email format) | Validation error returned, no user created | | |
| 10.5 | Confirm no secrets (JWT secret, Mongo URI, API keys) appear in frontend network responses or browser console | Nothing sensitive is exposed client-side | | |

## 11. Cross-Origin / Deployment Sanity (deployed environment only)

| # | Step | Expected Result | Pass/Fail | Notes |
|---|------|------------------|-----------|-------|
| 11.1 | Load the Vercel-hosted frontend against the Render-hosted backend | No CORS errors in console | | |
| 11.2 | Confirm Socket.io connects cross-origin | Real-time updates still work in production | | |
| 11.3 | Confirm OAuth redirects land back on the Vercel URL, not localhost | Redirect URLs are correct in production | | |
| 11.4 | Hit the backend after 15+ minutes idle (Render free tier sleep) | Cold start takes ~10-30s then works normally — expected, not a bug | | |

---

## Sign-off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Tester | | | |
| Mentor / Reviewer | | | |

**Overall result:** [ ] Accepted  [ ] Accepted with noted issues  [ ] Rejected — see notes above

**Known, accepted limitations (not defects):**
- Raw honeypot TCP ports are not internet-reachable when deployed on Render's free tier (see DEPLOYMENT.md, section "Important limitation: the honeypot listeners").
- mongodb-memory-server (local in-memory MongoDB fallback) is for local development only; production uses a persistent MongoDB Atlas cluster.
