# Database Migration 002: AI Memory

## Description
Implementation of the AI Context & Memory store, replacing MockMemoryStore.

## Collections
- `users/{userId}/ai/coaching_cache`: Cache for daily motivation/reflection snippets.
- `users/{userId}/ai/memory`: Long-term memory extracted from conversations (preferences, goals).
- `users/{userId}/ai/conversations`: Chat history.

## Indexes
- `users/{userId}/ai/conversations` on `createdAt` (DESC).
