# DecepShield AI — Deployment Guide

## Why the split (Vercel + Render), not "everything on Vercel"

Vercel runs your code as short-lived serverless functions. DecepShield AI's
backend needs a real, persistent process, because it:

- keeps Socket.io connections open for real-time dashboard updates
- runs a `setInterval` loop every 30s to poll for new incidents and call Gemini
- opens raw TCP listeners (`net.createServer`) for the SSH/FTP/MySQL/Redis
  honeypots — these need to bind and hold a port open indefinitely

None of that works on Vercel. So:

- **Frontend (React/Vite dashboard)** → **Vercel**. It's a static build, exactly
  what Vercel is for.
- **Backend (Express API, Socket.io, AI engine)** → **Render** (or Railway /
  Fly.io — same idea). These run your Node process continuously, like a small
  VPS, and have a free tier.

## Important limitation: the honeypot listeners

Render's free **Web Service** exposes exactly one public HTTP port. The
SSH/FTP/MySQL/Redis honeypot listeners bind to *other* TCP ports
(`net.createServer`), which will run inside the container but are **not
reachable from the internet** on Render's free tier — so a real attacker
scanning the internet won't find them there. This matches the constraint in
your original AWS EC2 plan for a reason: a honeypot's whole point is being
reachable on the ports it claims to serve, which needs a host that lets you
expose arbitrary TCP ports (a real VPS/EC2 instance, or Render's paid tier
with a "Private Service" + a reverse proxy, or similar).

**For the deployed demo**: the dashboard, auth, AI threat engine, evidence,
reports, and the `POST /api/incidents` ingestion endpoint all work fully on
Render's free tier — only the *raw TCP honeypot ports themselves* being
internet-reachable is the piece that needs a VPS. You can still demonstrate
the honeypots by running them locally (as you have been) and pointing
`HONEYPOT_API_URL`-style config at the deployed API, or by noting this as a
known scope boundary in your report.

## 1. MongoDB Atlas

You already have a working Atlas cluster (`MONGO_URI` in `API/.env`). Before
deploying:

1. In Atlas → Network Access, add `0.0.0.0/0` (or Render's static outbound IPs
   if you want it tighter) so Render can reach your cluster.
2. **Rotate the database user's password** — it was exposed in this chat
   session at one point, so treat it as compromised. Atlas → Database Access →
   edit the user → Edit Password. Update `MONGO_URI` everywhere it's used
   (your local `.env` and Render's env vars) after rotating.

## 2. Deploy the backend to Render

1. Push this repo to GitHub (if it isn't already).
2. In Render: **New → Blueprint**, point it at the repo. It will read
   `render.yaml` at the repo root and create a `decepshield-api` web service
   with `rootDir: API`.
3. In the service's **Environment** tab, set the secret values (Render leaves
   these blank from the blueprint on purpose — never commit real secrets):
   - `JWT_SECRET` — generate with
     `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   - `MONGO_URI` — your rotated Atlas connection string
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (if using Google login)
   - `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` (if using GitHub login)
   - `DISCORD_CLIENT_ID` / `DISCORD_CLIENT_SECRET` (if using Discord login)
   - `HONEYPOT_INGEST_KEY` — generate with the same `crypto.randomBytes` command
   - `FRONTEND_URL` — fill in *after* step 3 below, once you have the Vercel URL
   - `BACKEND_URL` — your Render URL, e.g. `https://decepshield-api.onrender.com`
4. Deploy. Confirm the logs show `API Server running on port 3001` and
   `Connected to MongoDB (persistent) successfully!`.

## 3. Deploy the frontend to Vercel

1. In Vercel: **New Project**, import the same repo, set **Root Directory** to
   `FRONTEND`. It auto-detects Vite and reads `FRONTEND/vercel.json`.
2. Add an environment variable: `VITE_API_URL` = your Render URL (e.g.
   `https://decepshield-api.onrender.com`).
3. Deploy. Note the resulting URL (e.g. `https://decepshield-ai.vercel.app`).
4. Go back to Render and set `FRONTEND_URL` to that Vercel URL, then redeploy
   the backend so CORS and OAuth redirects point at the right place.

## 4. Update OAuth provider settings

For each provider you use, add the **production** callback URL alongside your
existing localhost one (don't remove the localhost one — you still need it
for local dev):

- Google Cloud Console → Credentials → OAuth client → Authorized redirect URIs:
  add `https://<your-render-url>/api/auth/google/callback`
- GitHub → Developer Settings → OAuth Apps → your app → Authorization callback
  URL: GitHub only allows one, so either use a second OAuth app for prod, or
  swap it when demoing.
- Discord → Developer Portal → your app → OAuth2 → Redirects: add
  `https://<your-render-url>/api/auth/discord/callback`

## 5. Smoke test

1. Open the Vercel URL, register a local account (email/password) and log in.
2. Confirm the Dashboard loads and shows live stats (should be 0s on a fresh
   Atlas DB — that's expected).
3. Click **Simulate Attack** and confirm a new incident appears in real time
   (validates Socket.io works cross-origin in production).
4. Deploy a honeypot from the Honeypots page and confirm it saves (it will
   report "Running" even though, per the limitation above, it isn't
   internet-reachable on Render's free tier).

## Rollback / free-tier notes

- Render's free web services spin down after ~15 minutes idle and take
  10-30s to wake back up on the next request — expect a slow first load after
  inactivity. This is normal, not a bug.
- Vercel's free tier has no such sleep behavior.
