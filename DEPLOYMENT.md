# Ascend AI Production Deployment Guide

This document outlines the zero-touch CI/CD deployment pipeline for Ascend AI via Vercel and GitHub.

## Deployment Philosophy
**GitHub is the single source of truth.** No manual FTP uploads, zip files, or direct edits to the live environment.

The deployment process should always be:
`Develop Locally` -> `Test` -> `Commit` -> `Push to GitHub` -> `Vercel auto-builds` -> `Production updates`

## Repository Structure
We adhere to a standardized branch strategy to ensure production stability:
- `main` - **Production Branch**. Represents the live state of the application. Commits here auto-deploy to production.
- `develop` - **Development Branch**. The integration branch for new features before they hit production.
- `feature/*` - Used for active development (e.g., `feature/dashboard`).
- `hotfix/*` - Emergency fixes for production.
- `release/*` - Stabilization branch before merging to `main`.

## First Deployment

1. **Connect GitHub to Vercel**:
   - Log in to your Vercel Dashboard.
   - Click **Add New Project**.
   - Select **Import from Git Repository** and choose `IMady23/ascend-ai`.

2. **Configure Environment Variables**:
   - During the import process, expand the "Environment Variables" section.
   - Copy all variables from `.env.example` into the Vercel dashboard and provide their actual values (Firebase, Gemini API, JWT secret).

3. **Deploy**:
   - Click **Deploy**. Vercel will automatically run `npm run build` and provision the live environment.

## Updating Production

To release a new feature or update:
```bash
# Ensure you are on the correct branch (e.g., feature merged into develop, then into main)
git checkout main
git pull origin main

# Standard git workflow
git add .
git commit -m "Describe the production changes here"
git push origin main
```
*Vercel will immediately detect the push, run the build, and deploy the new version.*

## Rollback

If a production release introduces critical bugs, you can instantly rollback to the previous stable version using Vercel.

1. Go to the **Deployments** tab in your Vercel dashboard for Ascend AI.
2. Find the last stable deployment in the history list.
3. Click the three dots (`...`) next to the deployment and select **Redeploy** or **Promote to Production** (depending on your Vercel project settings).
4. The application will instantly revert without needing a new Git commit.

*After rolling back, fix the issue locally on a `hotfix/` branch, test, and push the fix through the normal pipeline.*
