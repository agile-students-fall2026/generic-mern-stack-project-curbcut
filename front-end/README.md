# CurbCut Front End

The CurbCut front end uses React, Vite, and npm.

## Setup

The setup was tested with Node.js v26.4.0 and npm v11.17.0.

From the repository root:

```bash
cd front-end
npm ci
npm run dev
```

Open the local URL printed in the terminal. Press Ctrl+C to stop the server.

No backend or environment variables are required to run the current starter application.

## Formatting and verification

Run these commands from `front-end/`:

```bash
npm run format
npm run format:check
npm run lint
npm run build
```

Prettier formats files and checks formatting. ESLint checks JavaScript and JSX code. The production build is generated in `dist/`, which is excluded from version control.

To preview the production build locally:

```bash
npm run preview
```

An automated application test suite has not been configured yet.

See the root [README](../README.md) for project information and [CONTRIBUTING](../CONTRIBUTING.md) for the contribution workflow.

### Sprint 1 report simulation

Initial sample reports load from `public/data/reports.json`.
Successful submissions are added to shared React state for the current session.
Refreshing reloads the samples and removes newly submitted reports and photos.
Reports are not uploaded or shared between users.

During `npm run dev`, the reporting form includes a “Simulate submission
failure” checkbox for testing failure feedback and retry. This control is
hidden in production builds.

The current success view is provisional; the complete confirmation screen
and navigation are tracked under #62.
