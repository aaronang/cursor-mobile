# GitHub Pages Deployment Guide

This project is configured to deploy to GitHub Pages using the `gh-pages` package.

## Prerequisites

1. Make sure your project is pushed to a GitHub repository
2. Ensure you have the necessary permissions to push to the repository

## Deployment Steps

### 1. Build and Deploy

Run the following command to build your project and deploy it to GitHub Pages:

```bash
npm run deploy
```

This command will:
- Run `npm run build` to create a production build
- Deploy the contents of the `dist` folder to the `gh-pages` branch
- Push the `gh-pages` branch to GitHub

### 2. Configure GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose the **gh-pages** branch
5. Click **Save**

### 3. Access Your Site

Your site will be available at:
```
https://[your-username].github.io/[repository-name]/
```

For this project, it will be:
```
https://[your-username].github.io/boilerplate-shadcn-stone/
```

## Important Notes

- The `base` URL in `vite.config.ts` is automatically configured for GitHub Pages
- The `predeploy` script ensures your project is built before deployment
- The `dist` folder contains your built project files
- Each deployment creates a new commit on the `gh-pages` branch

## Troubleshooting

- If you get permission errors, ensure you have write access to the repository
- If the site doesn't load, check that GitHub Pages is enabled and pointing to the `gh-pages` branch
- The first deployment may take a few minutes to become available

## Manual Deployment

If you prefer to deploy manually:

```bash
npm run build
npx gh-pages -d dist
```