/**
 * Lightweight performance/load test for DecepShield AI's API.
 *
 * Usage (with the API already running, e.g. `npm start` in another terminal):
 *   node loadtest.js
 *
 * What it does:
 *  1. Registers a throwaway test user and logs in to get a JWT.
 *  2. Runs a short autocannon load test against a couple of read endpoints
 *     (GET /api/stats, GET /api/honeypots) and the incident-ingestion
 *     endpoint (POST /api/incidents, using the test user's JWT).
 *  3. Prints a results summary you can paste into the report's
 *     "Testing Performed" section.
 *  4. Deletes the throwaway test user it created, so it doesn't leave junk
 *     in your database.
 *
 * Install the one extra dependency first (dev-only, not needed to run the app):
 *   npm install --no-save autocannon
 */
const autocannon = require('autocannon');
const mongoose = require('mongoose');
require('dotenv').config();

const BASE_URL = process.env.LOADTEST_BASE_URL || 'http://localhost:3001';
const DURATION_SEC = Number(process.env.LOADTEST_DURATION || 10);
const CONNECTIONS = Number(process.env.LOADTEST_CONNECTIONS || 10);

async function main() {
  const testEmail = `loadtest_${Date.now()}@decepshield.local`;
  const testPassword = 'Passw0rd123!';

  console.log(`\n== DecepShield AI load test against ${BASE_URL} ==\n`);

  console.log('Registering throwaway test user...');
  const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword, role: 'Security Analyst' }),
  });
  if (!regRes.ok) throw new Error(`Register failed: ${regRes.status} ${await regRes.text()}`);

  console.log('Logging in...');
  const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: testPassword }),
  });
  if (!loginRes.ok) throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
  const { token } = await loginRes.json();
  console.log('Got JWT.\n');

  const scenarios = [
    { name: 'GET /api/stats', opts: { url: `${BASE_URL}/api/stats`, method: 'GET' } },
    { name: 'GET /api/honeypots', opts: { url: `${BASE_URL}/api/honeypots`, method: 'GET' } },
    {
      name: 'POST /api/incidents (simulated attack, authenticated)',
      opts: {
        url: `${BASE_URL}/api/incidents`,
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'Load Test', ip: '203.0.113.9', target: 'Load Test Target', severity: 'Low' }),
      },
    },
  ];

  const summary = [];
  for (const s of scenarios) {
    console.log(`--- Running: ${s.name} (${CONNECTIONS} connections, ${DURATION_SEC}s) ---`);
    const result = await autocannon({
      ...s.opts,
      connections: CONNECTIONS,
      duration: DURATION_SEC,
      headers: { ...(s.opts.headers || {}), authorization: `Bearer ${token}` },
    });
    summary.push({
      name: s.name,
      reqPerSec: result.requests.average,
      latencyAvgMs: result.latency.average,
      latencyP99Ms: result.latency.p99,
      errors: result.errors,
      timeouts: result.timeouts,
      non2xx: result['2xx'] !== undefined ? result.non2xx : undefined,
    });
    console.log(autocannon.printResult(result));
  }

  console.log('\n== Summary (paste into the report) ==\n');
  console.table(summary);

  // Clean up the throwaway user so it doesn't linger in the database.
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      await mongoose.connection.collection('users').deleteOne({ email: testEmail });
      await mongoose.disconnect();
      console.log(`\nCleaned up test user ${testEmail}.`);
    } else {
      console.log(`\nNote: MONGO_URI not set, skipped automatic cleanup of test user ${testEmail}.`);
    }
  } catch (e) {
    console.log(`\nCould not auto-clean test user (${e.message}). Delete "${testEmail}" from the users collection manually if needed.`);
  }
}

main().catch((err) => {
  console.error('Load test failed:', err);
  process.exit(1);
});
