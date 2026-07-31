# Ascend AI v1.0 Deployment Guide

## Prerequisites
- **Vercel Account**: For deploying the Next.js frontend/backend.
- **Firebase Project**: Firestore, Authentication, Storage.
- **Upstash Redis**: Serverless Redis for Rate Limiting.
- **Sentry Account**: For Observability and Error Tracking.
- **Resend Account**: For transactional emails.
- **Google Cloud Platform**: Gemini API key.

## Environment Variables
The following must be set in your Vercel Project Settings:

### Core
`NEXT_PUBLIC_URL` = https://ascend-ai.vercel.app

### Firebase (Client & Server)
`NEXT_PUBLIC_FIREBASE_API_KEY`
`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
`NEXT_PUBLIC_FIREBASE_PROJECT_ID`
`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
`NEXT_PUBLIC_FIREBASE_APP_ID`
`FIREBASE_CLIENT_EMAIL` (Service Account)
`FIREBASE_PRIVATE_KEY` (Service Account)

### AI
`GEMINI_API_KEY` = your-gemini-2.5-pro-key

### Automation & Integrations
`CRON_SECRET` = securely-generated-string
`RESEND_API_KEY` = re_***
`UPSTASH_REDIS_REST_URL`
`UPSTASH_REDIS_REST_TOKEN`
`NEXT_PUBLIC_SENTRY_DSN`

## Vercel Cron Setup
In your `vercel.json`, verify the cron schedule:
```json
{
  "crons": [
    {
      "path": "/api/cron/daily",
      "schedule": "0 * * * *" 
    }
  ]
}
```
*Note: The endpoint executes hourly but uses timezone logic to reset users exactly when they cross midnight.*

## Security Rules Deployment
Run `firebase deploy --only firestore:rules` to push `firestore.rules`.

## Production Checklist
1. All env variables populated in Vercel.
2. Vercel deployment completes successfully.
3. Upstash Redis shows connections.
4. Sentry is receiving traces.
5. Gemini quota is configured.
