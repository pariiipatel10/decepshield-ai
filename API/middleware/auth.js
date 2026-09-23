const jwt = require('jsonwebtoken');

// Require JWT_SECRET to be explicitly set. Silently falling back to a
// hardcoded string would mean anyone who reads the source code could forge
// valid tokens against a misconfigured deployment.
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set. Add it to API/.env before starting the server.');
}

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded; // The payload has id, email, role
      return next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ error: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ error: 'Not authorized, no token' });
};

// Accepts either a logged-in user's JWT (used by the "Simulate Attack" demo
// button in the dashboard) OR the shared honeypot ingest key (used by the
// real honeypot listeners in services/honeypotManager.js). This is what
// guards POST /api/incidents so random requests on the internet can't inject
// fake incidents into the dashboard.
const protectOrIngestKey = (req, res, next) => {
  const ingestKey = req.headers['x-ingest-key'];

  if (ingestKey && process.env.HONEYPOT_INGEST_KEY && ingestKey === process.env.HONEYPOT_INGEST_KEY) {
    return next();
  }

  return protect(req, res, next);
};

module.exports = { protect, protectOrIngestKey };
