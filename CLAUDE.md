# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack torrent streaming application that allows users to browse and watch video torrents directly in their browser without downloading the entire file. The system fetches movie metadata from YTS API, stores it in MySQL, and streams torrents using WebTorrent.

**Tech Stack:**
- **Backend**: Node.js + Hono (web framework) + Sequelize 7 (MySQL ORM) + WebTorrent + Socket.IO
- **Frontend**: React 19 + Vite + styled-components + Zustand (state) + React Router v7
- **Database**: MySQL
- **Monorepo**: npm workspaces (server/ and client/)

## Common Commands

### Development
```bash
# Install all dependencies (server + client)
npm install

# Start both server (port 3900) and client (port 8900) in watch mode
npm start

# Start server only
npm --prefix server start

# Start client only
npm --prefix client start
```

### Building
```bash
# Build both server and client
npm run build

# Build server only (compiles TypeScript, moves files)
npm --prefix server run build

# Build client only (type-check + Vite build)
npm --prefix client run build
```

### Database & CLI
```bash
# Manually sync movies from YTS API to database
npm --prefix server run update-movies

# Run CLI utilities
npm --prefix server run cli

# Run cron jobs manually
npm --prefix server run cron
```

### Production Deployment
```bash
npm install
npm run build
npm add -g pm2
pm2 startup
pm2 start --name server /var/www/torrent-streaming/server/build/index.js
pm2 save
```

## Architecture Overview

### Data Flow: Movie Discovery to Streaming

1. **Movie Database Updates** (Cron Job every 12 hours):
   - `server/src/cron.ts` → `services/update-movies.ts`
   - Fetches top 1080p movies from YTS.lt API
   - Validates with Zod schemas, stores in MySQL `streams` table

2. **Movie Browsing** (Frontend → API):
   - User views `/streams` page → `GET /api/streams?page=X&q=query`
   - `server/src/actions/streams.ts` queries MySQL (sorted by seeds, rating, year)
   - Returns paginated movie list with metadata

3. **Movie Details**:
   - User clicks movie → `GET /api/stream/:uuid`
   - `server/src/actions/stream.ts` returns full metadata (synopsis, trailer, IMDB)

4. **Video Streaming**:
   - User clicks play → `GET /api/watch/:uuid`
   - `server/src/actions/watch.ts` uses `services/stream-to-file.ts`:
     - Finds highest quality torrent (≤1080p, prefers "web" over "bluray")
     - Adds torrent to WebTorrent client if not already downloading
     - Waits for MP4 file to be discovered (retries with timeout)
     - Streams video with HTTP Range requests (206 Partial Content)
     - Extracts and converts SRT subtitles to WebVTT if available

### Key Architectural Patterns

**Torrent Selection Logic** (`server/src/services/stream-to-file.ts`):
- Each `Stream` entity stores multiple torrents with quality/type/hash
- Selection prioritizes: 1) "web" type, 2) highest quality ≤1080p, 3) fallback to "bluray"
- Already-downloading torrents are reused (checked by infoHash)
- Files are deselected by default (only video/subtitle files are selected)

**Database Schema** (`server/src/entities/stream.ts`):
- Single `Stream` model with Sequelize decorators
- Stores torrents as JSON array with hash/quality/seeds/type
- Indexed on uuid, apiId, title, year, rating, seeds for fast queries
- `seeds` field is denormalized from torrents array for sorting

**Config & Environment** (`server/src/config.ts`):
- Loads `.env` from root directory
- Defines paths: `root`, `data`, `torrents` (where WebTorrent downloads)
- SOCKS proxy configuration (optional, for YTS API access)
- WebTorrent port, torrent trackers, CORS origins

**Frontend State** (`client/src/state/app-state.ts`):
- Zustand store manages global UI state
- API calls via `client/src/services/api.ts` (fetch wrapper)
- Config determines API URL dynamically based on window location

### Critical Files

| Path | Purpose |
|------|---------|
| `server/src/index.ts` | Server entry point - syncs DB, starts HTTP/Socket.IO |
| `server/src/services/server.ts` | Hono app with routes + Socket.IO setup |
| `server/src/services/database.ts` | Sequelize MySQL connection |
| `server/src/services/stream-to-file.ts` | WebTorrent integration - torrent → video file |
| `server/src/services/update-movies.ts` | YTS API sync logic |
| `server/src/actions/watch.ts` | Video streaming endpoint with Range requests |
| `server/src/actions/streams.ts` | Movie list with search/pagination |
| `server/src/cron.ts` | Scheduled tasks (update movies, cleanup, restart) |
| `server/src/entities/stream.ts` | Sequelize model for movies/torrents |
| `client/src/pages/streams/streams.tsx` | Movie list page with infinite scroll |
| `client/src/pages/stream/stream.tsx` | Movie detail + video player |
| `client/src/components/video-embed/video-embed.tsx` | HTML5 video player |

## Important Implementation Details

### WebTorrent File Discovery
The `findVideoFile()` and `findSubtitleFile()` functions in `stream-to-file.ts` poll for files with retries because WebTorrent doesn't immediately expose files after adding a torrent. Don't remove this retry logic.

### Build Process Quirk
The server build script (`server/bin/build.sh`) compiles TypeScript, runs `tsconfig-replace-paths` for path aliases, then flattens the `build/src/` directory to `build/`. This is why production imports work correctly.

### Proxy Configuration
The SOCKS proxy settings in `.env` are optional but recommended for accessing YTS API if it's blocked in your region. The proxy is used in `server/src/services/agent.ts` via the `socks` package.

### Cron Jobs in Production
When `NODE_ENV=production`, the server automatically runs cron jobs:
- Every 12 hours: Update movie database
- Every 6 hours: Delete old torrent files from `server/torrents/`
- Daily at 2 AM: Restart server via PM2

### MySQL vs SQLite
The codebase includes both `@sequelize/mysql` and `@sequelize/sqlite3` dependencies. Currently configured for MySQL. If switching to SQLite, update `server/src/services/database.ts` and remove MySQL-specific config.

### Environment Variables
Copy `.env.example` to `.env` before starting. Required vars:
- `DATABASE_*`: MySQL connection details
- `PORT`: Server port (default 3900)
- `WEBTORRENT_PORT`: WebTorrent DHT port (default 9999)
- `API_URL` / `APP_URL`: Used for CORS and client config
- `PROXY_*`: Optional SOCKS proxy for YTS API

## Development Workflow

1. **Adding a new API endpoint:**
   - Create handler in `server/src/actions/`
   - Register route in `server/src/services/server.ts`
   - Add corresponding API call in `client/src/services/api.ts`

2. **Database schema changes:**
   - Modify `server/src/entities/stream.ts` (or create new entity)
   - Restart server - Sequelize auto-syncs schema in development
   - For production, consider manual migrations

3. **Frontend page/component:**
   - Add page to `client/src/pages/`
   - Add route in `client/src/components/app/app.tsx`
   - Use Zustand store (`client/src/state/app-state.ts`) for shared state

4. **Debugging WebTorrent issues:**
   - Check `server/torrents/` directory for downloaded files
   - Inspect `client.torrents` in `server/src/services/webtorrent.ts`
   - Verify torrent hash is valid (20-byte hex string)
   - Ensure `WEBTORRENT_PORT` is not blocked by firewall
