# Database Migration 004: Analytics Storage

## Description
Aggregated analytics tracking event counts and totals across time periods (daily, weekly, monthly, lifetime).

## Collections
- `users/{userId}/analytics/daily`: Aggregates for specific days.
- `users/{userId}/analytics/weekly`: Aggregates for specific weeks.
- `users/{userId}/analytics/monthly`: Aggregates for specific months.

## Schema
Documents contain computed fields like `totalCalories`, `averageWater`, `workoutConsistency`, and `score` (Ascend Score).
