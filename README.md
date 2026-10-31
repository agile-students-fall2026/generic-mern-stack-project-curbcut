# CurbCut

CurbCut is a mobile web app being developed to help students check accessibility information before traveling around NYU. It brings together building entrance details and community reports about barriers such as blocked ramps, elevator outages, and construction.

## Why do we need CurbCut?

A trip to class involves more than finding a building on a map. Students who need step-free access may also need to locate a particular entrance, find an elevator, or check whether a familiar path is temporarily blocked.

Our motivation comes from the hope that discovering a barrier after arriving can mean retracing a route, asking for assistance, or finding alternatives early on to prevent missing classes. We hope that sharing these observations could help other students prepare before they leave for their classes.

## Product Vision Statement

Our vision is to make campus travel more predictable for students with mobility-related access needs. At its core, anyone should be able to choose the right path to the right location using information that is close to real time.

CurbCut aims to give the NYU community a shared place to find entrance information, review recent barrier reports, and contribute updates. By making access conditions easier to understand, we hope to support greater independence and reduce unexpected obstacles during everyday campus travel.

## Implementation Plan

Our initial version will focus on a small set of NYU buildings and nearby approaches. We have not decided on every building yet, but we plan to start with the first 5 floors of Kimmel Center.

Our planned capabilities include:

- searching for a supported building
- viewing documented entrance and step-free access information
- browsing recent barrier reports associated with a building or entrance
- submitting a report with a location, barrier, category and description
- searching for a specific barrier that was added and when that barrier was observed and last updated
- contributing follow-up observations when conditions change

Community reports will be identified separately from documented building information. An absence of reports will not be presented as confirmation that a location is accessible.

We do not plan to add automatic route planning although it could be a possible future extension outside the initial scope.

## Core User Journey

1. Users open the home page, which shows the most recently updated reports.
2. They search for a building and are taken to that building's page.
3. The building page shows recent reports of obstacles affecting the entrance the student wants to use.
4. The home page also has a quick way to report a barrier.
5. Users can submit a new observation or update an existing report.

## Project Status

CurbCut is currently in Sprint 1: front-end development. The React project has been initialized using Vite. Application screens and interactions are being implemented from the wireframes and clickable prototype.

## Front-end Setup

Install Node.js and npm. This setup was tested with Node.js v26.4.0 and npm v11.17.0.

From the repository root:

```bash
cd front-end
npm ci
npm run dev
```

Open the local URL printed in the terminal. Press Ctrl+C to stop the development server.

To check the code and create a production build, run these from front-end/:

```bash
npm run lint
npm run build
```

The build output is generated in front-end/dist/ and is excluded from version control.

The current front end contains the React starter application. No backend or environment variables are required to run it.

## UX Design

The app map, wireframes, screen descriptions and a link to the clickable prototype are in [UX-DESIGN.md](./ux-design/UX-DESIGN.md).

## Contributing

Read our [contribution guidelines](./CONTRIBUTING.md) for the development workflow, contribution rules and development environment setup.

## Planned Technology Stack

CurbCut will be a full-stack JavaScript web app built with:

- **React** for the front end
- **Express.js** on **Node.js** for the back end
- **MongoDB** with **Mongoose** for storing buildings, entrances and reports

Build and run instructions will be added here once development starts in Sprint 1.

## Repository Structure

```text
curbcut/
├── front-end/       # React front end
├── back-end/        # Express back end
├── ux-design/
│   ├── UX-DESIGN.md # Design links, app map and screen descriptions
│   ├── app-map.png
│   ├── wireframes/ # Individual PNG files for M01–M21
│   ├── wireframes.drawio
│   └── prototype/
├── README.md
└── CONTRIBUTING.md
```

The repository also contains course automation files (`.automations`, `.github`, `.githooks`), which should not be modified.

## Team

- Abdullah — [Alphaspirit1908](https://github.com/Alphaspirit1908)
- Gillani — [muhammad322](https://github.com/muhammad322)
- Hoang Ngo — [ogngnaoh](https://github.com/ogngnaoh)
- Hudhaifah — [hrehman1](https://github.com/hrehman1)

All team members are developers. The Product Owner and Scrum Master roles rotate every sprint.

## License

See [License](./LICENSE.md) for the project's license terms.

