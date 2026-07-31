# Database Migration 005: Reports

## Description
Stores generated user reports for performance review (daily, weekly, monthly).

## Collections
- `users/{userId}/reports/daily`: Snapshot of daily metrics, gamification updates, and next day goals.
- `users/{userId}/reports/weekly`: Weekly aggregation of stats and AI insights.
- `users/{userId}/reports/monthly`: Monthly overview and long-term trend analysis.

## Schema
Reports include an `id`, `date`, `read` boolean, `metrics`, `gamification` snapshot, and `insights` (AI-generated).
