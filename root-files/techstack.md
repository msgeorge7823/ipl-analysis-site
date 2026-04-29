# IPL Analysis Website - Tech Stack

---

## 1. Frontend

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **React.js**            | 18.x      | Core UI library — component-based architecture, virtual DOM, hooks      |
| **Vite**                | 5.x       | Build tool & dev server — instant HMR, fast bundling, ES module-based   |
| **React Router**        | v6        | Client-side routing with nested layouts, dynamic routes, lazy loading   |
| **Redux Toolkit (RTK)** | 2.x       | Client state management — global filters, UI state, theme, user preferences, with Redux DevTools for debugging |
| **TanStack Query**      | v5        | Server state management — caching, background refetching, pagination    |

### UI Component Library

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **ShadCN/UI**           | latest    | Primary UI library — pre-built accessible components (Button, Card, Dialog, Tabs, Table, Select, Dropdown, Accordion, Sheet, Tooltip, etc.) built on Radix UI + Tailwind CSS. Components are copied into the project, fully customizable. |
| **Radix UI**            | latest    | Underlying headless primitives powering ShadCN components — accessibility, keyboard nav, focus management |
| **Lucide React**        | latest    | Icon library — default icon set used by ShadCN/UI, clean & consistent   |

### Styling & Design (Mobile-First)

> **Design methodology: Mobile-first.** All Tailwind CSS classes are written mobile-first — base classes target the smallest screen, responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) add overrides for progressively larger screens. Six breakpoints are configured: Base (< 640px), sm (≥ 640px), md/Tablet (≥ 768px), lg/Desktop (≥ 1024px), xl (≥ 1280px), 2xl (≥ 1536px). Every component, page layout, data table, chart, and navigation element adapts across all breakpoints.

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **Tailwind CSS**        | 3.x       | Utility-first CSS framework — mobile-first responsive design, foundation for ShadCN components & custom styling |
| **Framer Motion**       | 11.x      | Animations — page transitions, hover effects, loading states, charts    |
| **tailwind-merge**      | latest    | Merge Tailwind classes without conflicts (used internally by ShadCN)    |
| **clsx**                | latest    | Conditional class name utility for clean Tailwind logic                 |
| **class-variance-authority (cva)** | latest | Variant-based component styling — used by ShadCN for component variants |

### Data Visualization

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **Recharts**            | 2.x       | Primary charting library — bar, line, pie, radar, area charts (ShadCN provides a Chart component wrapper around Recharts) |
| **Chart.js + react-chartjs-2** | 4.x | Secondary charting — doughnut charts (dismissal breakdowns), gauges    |

### Tables & Data Display

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **ShadCN Data Table**   | (built-in)| Table component built on TanStack Table — sorting, filtering, pagination, column resizing, all pre-styled with ShadCN theme |
| **TanStack Table**      | v8        | Headless table engine powering ShadCN's Data Table component            |

---

## 2. Backend

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **Node.js**             | 20.x LTS  | JavaScript/TypeScript runtime — async I/O, large ecosystem             |
| **NestJS**              | 10.x      | Backend framework — modular architecture, decorators, DI, guards, pipes, interceptors |
| **TypeScript**          | 5.x       | Type safety across the entire backend codebase                          |
| **@nestjs/config**      | latest    | Environment variable management via ConfigModule                        |
| **@nestjs/swagger**     | latest    | Auto-generated Swagger/OpenAPI documentation for all endpoints          |
| **@nestjs/throttler**   | latest    | API rate limiting to prevent abuse                                     |
| **class-validator**     | latest    | DTO validation via decorators — request body/query param validation     |
| **class-transformer**   | latest    | Object transformation — serialize/deserialize DTOs                      |
| **helmet**              | latest    | HTTP security headers (via NestJS middleware)                           |
| **compression**         | latest    | Gzip response compression for faster data transfer                     |

---

## 3. Database

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **PostgreSQL**          | 16.x      | Primary relational database — complex joins, materialized views, JSON support, window functions for rankings |
| **TypeORM**             | 0.3.x     | Database ORM — decorator-based entities, migrations, repository pattern, query builder, seeding via custom scripts |
| **@nestjs/typeorm**     | latest    | NestJS integration module for TypeORM — inject repositories into services seamlessly |

### Why PostgreSQL over alternatives?

- **Complex Joins**: Player stats span multiple tables (ball_by_ball, scorecards, player_teams, matches) — PostgreSQL handles this efficiently.
- **Materialized Views**: Career and season rankings are maintained as materialized views, refreshed periodically.
- **Window Functions**: `RANK()`, `DENSE_RANK()`, `ROW_NUMBER()` for player ranking computations.
- **JSON/JSONB**: Flexible storage for semi-structured data (auction bidding wars, match highlights).
- **Aggregation Performance**: `GROUP BY` with `FILTER` clause for phase-wise, situational, and positional stats from ball-by-ball data.
- **Full-Text Search**: `tsvector` / `tsquery` for global search across players, teams, and matches.

---

## 4. Data Processing & Seeding

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **TypeORM Seeding**     | custom    | Database seeding via custom NestJS CLI commands / seed scripts          |
| **typeorm-extension**   | latest    | Seeding & factory support for TypeORM                                  |
| **csv-parser**          | latest    | Parse CSV datasets (CricSheet, Kaggle) into JSON for seeding           |
| **axios**               | latest    | Fetch data from public cricket APIs during data collection (NestJS HttpModule) |

### Data Sources

| Source                  | Type          | Data Provided                                                     |
| ----------------------- | ------------- | ----------------------------------------------------------------- |
| **CricSheet**           | Open CSV/JSON | Ball-by-ball data, match results, player rosters (primary source) |
| **Kaggle IPL Datasets** | Open CSV      | Historical match data, player stats, auction data                 |
| **ESPNcricinfo**        | Web Scraping  | Player bios, coaching staff, sponsor details, auction narratives  |
| **IPL Official Site**   | Web Scraping  | Team management, sponsor logos, official records                  |
| **Manual Curation**     | Manual        | Coach profiles, sponsor financials, match analyses, highlights    |

---

## 5. Development Tools

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **ESLint**              | 9.x       | JavaScript/TypeScript/JSX linting — code quality and consistency        |
| **Prettier**            | 3.x       | Code formatting — consistent style across the codebase                  |
| **Git**                 | latest    | Version control                                                         |
| **GitHub**              | —         | Repository hosting, issue tracking, PR reviews                          |
| **npm**                 | 10.x      | Package manager                                                        |
| **NestJS CLI**          | latest    | Scaffold modules, controllers, services; auto-restart in dev mode (`nest start --watch`) |
| **Concurrently**        | latest    | Run frontend and backend dev servers simultaneously                     |

---

## 6. Testing

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **Vitest**              | latest    | Unit testing for frontend (Vite-native, fast, Jest-compatible API)      |
| **React Testing Library** | latest  | Component testing — render, query, user event simulation                |
| **Jest**                | latest    | Unit & integration testing for NestJS backend (built-in with NestJS)    |
| **Supertest**           | latest    | HTTP endpoint testing for NestJS controller routes                      |
| **@nestjs/testing**     | latest    | NestJS testing utilities — create testing modules with DI               |

---

## 7. Deployment & Hosting

| Technology              | Purpose                                                                     |
| ----------------------- | --------------------------------------------------------------------------- |
| **Netlify**             | Frontend hosting — automatic deploys from Git, edge CDN, deploy previews on PRs, custom domain support |
| **Firebase (Cloud Functions)** | Backend hosting — NestJS deployed as Firebase Cloud Functions (serverless), auto-scaling |
| **Firebase Hosting**    | Optional static asset serving alongside Cloud Functions                      |
| **GitHub Actions**      | CI/CD pipeline — lint, test, build, and deploy on push/PR                   |

### Firebase Services Used

| Service                      | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| **Cloud Functions (2nd gen)**| Host the NestJS backend as a serverless function                       |
| **Cloud Firestore** (optional)| Can complement PostgreSQL for real-time features in future scope      |
| **Firebase CLI**             | Local emulation, deployment, and management of Firebase resources      |

### Environment Strategy

| Environment   | Frontend              | Backend                    | Database              |
| ------------- | --------------------- | -------------------------- | --------------------- |
| **Local Dev** | localhost:5173        | localhost:3000              | Local PostgreSQL      |
| **Staging**   | Netlify Deploy Preview| Firebase Functions (staging)| Cloud SQL Dev DB      |
| **Production**| Netlify Prod          | Firebase Functions (prod)   | Cloud SQL Prod DB     |

> **Note on PostgreSQL with Firebase**: Firebase Cloud Functions can connect to an external PostgreSQL database hosted on **Google Cloud SQL**, **Supabase**, **Neon**, or **Railway**. TypeORM connects via the standard `DATABASE_URL` environment variable set in Firebase config.

---

## 8. Performance & Optimization

| Technique                     | Technology / Approach                                              |
| ----------------------------- | ------------------------------------------------------------------ |
| **Code Splitting**            | React.lazy() + Suspense — load pages on demand                    |
| **Image Optimization**        | Lazy loading, WebP format, responsive `srcset`                    |
| **API Response Caching**      | TanStack Query stale-while-revalidate + NestJS CacheInterceptor   |
| **Database Query Optimization** | Indexed columns, materialized views for rankings, query analysis |
| **Gzip Compression**          | NestJS `compression` middleware                                   |
| **CDN**                       | Netlify Edge Network for static assets                            |
| **Bundle Analysis**           | `vite-plugin-visualizer` to monitor bundle size                   |

---

## 9. Live Match & Real-Time Data

| Technology              | Version   | Purpose                                                                 |
| ----------------------- | --------- | ----------------------------------------------------------------------- |
| **WebSockets (@nestjs/websockets + Socket.IO)** | latest | Real-time bidirectional communication — pushes live match scores, ball-by-ball updates, and commentary to connected clients instantly without polling |
| **@nestjs/schedule (Cron)** | latest | Scheduled jobs — periodic polling of upstream data sources (CricAPI, ESPNcricinfo live feeds) every 15-30 seconds during a live match to fetch latest score and ball data |
| **Redis**               | 7.x       | In-memory pub/sub broker — WebSocket gateway publishes live events to Redis channels; all connected server instances receive and broadcast to clients. Also used for server-side caching of frequently accessed stats and H2H queries |
| **EventEmitter2**       | latest    | Internal event system — when a new ball is ingested, emit events that trigger: score update broadcast, ball-by-ball commentary push, cap race recalculation, rating recalculation, points table update |
| **Bull / BullMQ**       | latest    | Job queue — heavy post-match tasks (rating recalculation, materialized view refresh, cap race update) are queued as background jobs so they do not block the live feed |

### Live Match Data Pipeline

```
Upstream Source (CricAPI / ESPNcricinfo Live Feed / Official IPL Feed)
    │
    ▼ (poll every 15-30 sec during live match via @nestjs/schedule cron job)
NestJS Live Ingestion Service
    │
    ├── Validate & normalize ball data
    ├── Insert into ball_by_ball table
    ├── Update batting/bowling scorecard rows
    ├── Update match score (team1_score, team2_overs, etc.)
    │
    ▼ (EventEmitter2 emits 'ball.new' event)
NestJS WebSocket Gateway (Socket.IO)
    │
    ├── Broadcast to 'match:{matchId}:score' channel → Live score update
    ├── Broadcast to 'match:{matchId}:ball' channel → Ball-by-ball update with commentary
    ├── Broadcast to 'match:{matchId}:wicket' channel → Wicket alert
    ├── Broadcast to 'match:{matchId}:milestone' channel → 50/100/5W alerts
    │
    ▼ (Redis Pub/Sub for multi-instance sync)
All connected frontend clients receive real-time updates
```

### Data Authenticity & Freshness

| Principle | Implementation |
| --------- | -------------- |
| **Authentic data only** | All data sourced from verified, authoritative sources — CricSheet (open data, peer-reviewed), official IPL/BCCI feeds, ESPNcricinfo. No fabricated or estimated data. |
| **Live during matches** | Ball-by-ball data ingested within 15-30 seconds of each delivery during a live match via upstream API polling |
| **Post-match finalization** | After match completion, a finalization job cross-verifies all ball-by-ball data, scorecards, and results against multiple sources before marking the match as "verified" |
| **Dynamic updates** | When a match is completed today, the following update automatically: match scorecards, player career stats, player ratings, cap race standings, points table, season records, leaderboard rankings |
| **Materialized view refresh** | All materialized views (rankings, leaderboard, cap race standings) are refreshed within 5 minutes of match completion via BullMQ background job |
| **Data versioning** | Every data update is timestamped. If a correction is needed (e.g., a scoring error is revised), the system supports retroactive updates that cascade through all affected computed stats |

---

## 10. Future Scope (Not in current build)

| Technology              | Purpose                                                                 |
| ----------------------- | ----------------------------------------------------------------------- |
| **NextAuth.js / Clerk** | User authentication — saved preferences, favourites, watchlists         |
| **Elasticsearch**       | Advanced full-text search with fuzzy matching and auto-suggestions       |
| **PWA (Workbox)**       | Progressive Web App — offline support, installable on mobile            |
| **i18n (react-i18next)**| Multi-language support (Hindi, Tamil, Telugu, etc.)                     |

---

## Stack Summary

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
│  React 18 + Vite + ShadCN/UI + Tailwind CSS        │
│  Framer Motion + Redux Toolkit + TanStack Query      │
│  React Router v6                                     │
│  Recharts + Chart.js + ShadCN Data Table           │
├─────────────────────────────────────────────────────┤
│                    BACKEND                          │
│  Node.js 20 + NestJS 10 + TypeScript               │
│  TypeORM + REST API + Swagger                      │
├─────────────────────────────────────────────────────┤
│                   DATABASE                          │
│  PostgreSQL 16                                      │
│  Materialized Views + Full-Text Search              │
├─────────────────────────────────────────────────────┤
│                  DEPLOYMENT                         │
│  Netlify (Frontend) + Firebase Cloud Functions (API)│
│  Cloud SQL / Supabase / Neon (PostgreSQL)           │
│  GitHub Actions (CI/CD)                             │
└─────────────────────────────────────────────────────┘
```
