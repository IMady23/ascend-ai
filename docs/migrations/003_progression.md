# Database Migration 003: Gamification & Progression

## Description
Tracks user experience points (XP), levels, streaks, and achievements. Replaces the legacy system with structured objects.

## Collections
- `users/{userId}/progression/profile`: Stores XP (total, level), streak data, and unlocked achievements.
- `users/{userId}/progression/timeline`: Log of all gamification events (e.g. "Earned 20 XP for workout").

## Rules
- Clients are explicitly denied write access to `users/{userId}/progression`.
- Only server environments (Admin SDK) can update these fields.
