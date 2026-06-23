# Architecture

DecepShield AI is divided into five main parts:

1. Honeypot Layer
2. API Layer
3. AI/ML Layer
4. Database Layer
5. Dashboard Layer

## Honeypot Layer

The honeypot layer contains fake services that appear vulnerable. These services do not give real access to any system. They only collect interaction data.

## API Layer

The API layer receives events from honeypots, stores them, and sends live updates to the dashboard.

## AI/ML Layer

The AI/ML layer classifies suspicious behavior and assigns a risk score.

## Database Layer

The database stores attack sessions, payloads, IP addresses, timestamps, and classification results.

## Dashboard Layer

The dashboard shows live events, attacker sessions, risk scores, attack types, and reports.