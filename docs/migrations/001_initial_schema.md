# Database Migration 001: Initial Schema

## Description
Initial schema setup for Ascend AI. Contains foundational collections for Users and DailyLogs.

## Collections
- `users`: Core profile data (`identity`, `settings`).
- `users/{userId}/logs`: Subcollection for `DailyLog` (nutrition, hydration, steps).

## Indexes
- `users/{userId}/logs` on `date` (ASC) for querying by specific dates.
