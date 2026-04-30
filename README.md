# InkMotion

AI-powered graffiti lettering and whiteboard animation platform. Converts plain text into stylized typography, layered vector assets, and animation-ready outputs.

## Architecture

```
inkmotion-web/          ← Next.js frontend (Vercel)
  src/
    app/                ← App Router pages
    components/         ← UI components
    hooks/              ← useGeneration, useExport
    lib/                ← API client, constants
    types/              ← Shared TypeScript types

backend/                ← FastAPI backend (Render)
  app/
    routes/             ← /health, /generate, /export/*
    services/           ← generation, svg_composer, stroke_planner, export
    schemas/            ← Pydantic request/response models
    config.py           ← Settings via pydantic-settings
```

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.11+, Pydantic v2 |
| Database / Auth | Supabase (project save/load — post-MVP) |
| Frontend deploy | Vercel |
| Backend deploy | Render |

## Style Presets

- **Gloss Black Drip** — high-contrast black with gloss highlights and paint drips
- **Marker Bubble** — fat rounded letters with marker fill and thick outline
- **Club Red Yellow** — bold red and yellow with chrome-style depth
- **Clean Sticker** — flat color with white border, sticker-ready

## Local Development

### Frontend

```bash
cp .env.example .env.local
npm install
npm run dev
```

Runs at `http://localhost:3000`.

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Runs at `http://localhost:8000`. API docs at `/docs`.

## Environment Variables

### Frontend (`.env.local`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (post-MVP) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (post-MVP) |

### Backend (`.env`)

| Variable | Description |
|---|---|
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/generate` | Generate typography from text + preset |
| POST | `/export/svg` | Export as SVG string |
| POST | `/export/png` | Export as base64 PNG (2× resolution) |
| POST | `/export/json` | Export stroke data as JSON |

## Deployment

### Vercel (frontend)

1. Connect the repo to Vercel
2. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
3. Deploy — no build config needed, Next.js is auto-detected

### Render (backend)

1. Create a new **Web Service** pointing to `backend/`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add env vars from `backend/.env.example`

A `render.yaml` is included for infrastructure-as-code deploys.

## Data Models

### `projects`
```sql
id          uuid primary key
user_id     uuid references auth.users
text        text
preset      text
config_json jsonb
output_json jsonb
created_at  timestamptz default now()
```

### `exports`
```sql
id          uuid primary key
project_id  uuid references projects
type        text  -- svg | png | json
url         text
created_at  timestamptz default now()
```
