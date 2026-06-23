# decepshield-ai
AI-powered cyber deception and honeypot intelligence platform
# DecepShield AI

DecepShield AI is an AI-powered cyber deception and honeypot intelligence platform. It simulates fake vulnerable services, captures suspicious activity, classifies attacker behavior, assigns risk scores, and visualizes attack sessions in a real-time dashboard.

## Objective

The objective of this project is to build a safe and controlled deception environment where suspicious interactions with fake services can be logged, analyzed, and converted into useful threat intelligence.

## Core Features

- Fake login honeypot
- Fake API honeypot
- Attacker session tracking
- Payload inspection
- AI-based attack classification
- Risk scoring
- Real-time dashboard
- Attack timeline
- Generated defense rules
- Report export

## Tech Stack

- Go: honeypot services
- Node.js: API and WebSocket server
- TypeScript + React: frontend dashboard
- Python: AI/ML classification engine
- PostgreSQL: event and session storage
- Docker: service isolation and deployment
- Rust: optional high-speed payload scanner

## MVP Features

The first version will include:

- Fake admin login page
- Capture username, password, IP address, user agent, and timestamp
- Store captured events
- Basic attack type classification
- Risk score generation
- Live dashboard showing captured events

## Folder Structure
decepshield-ai/
  frontend/
  api/
  honeypots/
  ml-engine/
  database/
  docs/
  README.md