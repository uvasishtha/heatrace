# Heatrace

> Deployment intelligence for engineering teams.

Heatrace connects **GitHub deployment activity with Datadog production telemetry** to help engineering teams identify and investigate potential production regressions.

Instead of viewing code changes and production metrics separately, Heatrace correlates deployments with changes in error rates, latency, and other service-level metrics.

**Site:** https://heatrace.vercel.app/

## MVP

- 🚀 **Deployment Tracking** — visualize GitHub deployments, pull requests, commits, and code changes
- 📊 **Telemetry Correlation** — connect deployments with Datadog production metrics
- 🚨 **Regression Detection** — identify significant changes in error rates, latency, and HTTP 5xx responses after deployments
- 🔎 **Deployment Drill-downs** — investigate code changes alongside their production impact
- 🔥 **Service Health** — visualize service health and deployment activity across time

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- GitHub REST API
- Datadog API
- Python
- GitHub Actions
- Vercel

## Status

🚧 In progress

Currently building the frontend MVP with simulated GitHub deployment and Datadog telemetry data. Real API integrations and data ingestion are planned.

## Development

```bash
npm install
npm run dev
```
