# Electric Shoe Shop — Web Platform

Monorepo for the Electric Shoe Shop web application and supporting AWS infrastructure.

## Prerequisites

- Node.js 18+
- npm
- AWS CLI (v2 or later)

## Quick Start

```bash
npm i
npm run dev
```

The development server starts on `http://localhost:3000`.

## Environment Setup

Copy `apps/shop-front/.env.template` to `apps/shop-front/.env.local` and fill in the required credentials. For a full list of environment variables and their descriptions, refer to the internal wiki page **Platform > Environment Variables** (Confluence).

**Note:** Some variables in the template are marked as deprecated. These are kept for backward compatibility during the migration to AWS Secrets Manager. You can leave them blank unless you are working on the legacy Lambda functions in `apps/backend/ERP/`.

## Tech Stack

- TypeScript
- Next.js 15 (App Router)
- React 19
- Tailwind CSS + DaisyUI 5
- AWS DynamoDB
- AWS Cognito (authentication)
- AWS CDK (infrastructure)
- Turborepo (build orchestration)

## Project Structure

```
apps/
  shop-front/       — Next.js web application
  backend/          — Lambda functions for ERP sync and inventory
packages/
  iac/              — AWS CDK infrastructure definitions
  shared-types/     — Shared domain models (not yet extracted)
```

The `packages/shared-types/` directory does not exist yet. Types are currently duplicated between the frontend and backend. This was accepted as technical debt during the initial MVP phase and is tracked for cleanup.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all apps in development mode |
| `npm run build` | Production build |
| `npm run test` | Run all test suites |
| `npm run test:ci` | Run tests with coverage reporting |
| `npm run cdk:synth` | Synthesize CDK stacks |
| `npm run cdk:deploy` | Deploy infrastructure to AWS |

## Deployment

Production deployments are handled via the internal CI/CD pipeline. Manual deployment is possible but discouraged outside of emergency hotfixes.

```bash
cd packages/iac
npx cdk deploy ProdStack
```

**Note:** The staging environment was decommissioned in March 2024. For pre-production testing, use the review app flow or ask in `#platform-support` for a temporary sandbox stack.

## Common Issues

**Empty product list on first run**

The application expects DynamoDB tables to exist and contain seed data. If you see an empty shop page, ensure your AWS credentials are valid and the tables are populated. A seed script is referenced in `package.json` (`db:seed`) but is not yet committed to the repo. Contact the Platform team for the latest version.

**Build errors related to type mismatches**

Some files use `// @ts-ignore` or Biome suppressions to work around known type issues. Run `npm run fmt` before committing to ensure consistent formatting.

**Authentication issues during local development**

NextAuth expects a valid Cognito client ID. Make sure `COGNITO_CLIENT_ID` is set in your `.env.local`. The development pool is `hiring-process-shop-front-web-app-auth` (legacy name from initial setup).

## Testing

Tests are split between the frontend (`apps/shop-front`) and backend (`apps/backend`) packages. Some backend tests require a LocalStack instance or valid AWS credentials and are skipped by default.

Run the full suite with `npm run test`. For CI, use `npm run test:ci`.

## Contributing

- Follow the existing DDD-inspired folder structure under `_domain/`, `_adapter/`, and `_uiFragments/`
- Run `npm run fmt` and `npm run lint` before opening a PR
- Backend Lambda changes should include corresponding CDK updates in `packages/iac/`

Questions? Reach out in `#platform-support` or ping the on-call engineer.

---

Last updated: January 2024
Platform Team
