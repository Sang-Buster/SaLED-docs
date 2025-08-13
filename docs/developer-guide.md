---
outline: deep
---

# Developer Guide

This guide explains the architecture, key modules, and how to extend SaLED.

### Repository layout

- Backend: `backend/saled`
  - `app/main.py`: FastAPI app, CORS, health, router registration.
  - `app/routers`: API endpoints for `transcribe`, `summary`, `chat`, `retranslate`.
  - `core/services`: Business logic; stateless where possible, with in-memory job/result stores.
  - `core/models`: Adapters like `WhisperTranscriber` and `LLMService`.
  - `cli`: Typer-based CLI for model management and local transcription.
- Frontend: `frontend` Next.js UI.

### Backend architecture

- FastAPI app exposes REST + WebSocket.
- Request-scoped headers: `X-Request-ID`, `X-Process-Time-Ms` added by middleware.
- Routers:
  - Transcribe: start job, list jobs, get status, get result, live WebSocket stream.
  - Summary: start job, get status, get result.
  - Chat: synchronous responses to transcript-grounded prompts; list available models.
  - Retranslate: reprocess segment from uploaded clip or from full audio registered by job.

### Services

#### `TranscriptionService`

- Saves uploaded file, assigns `job_id`, spawns background processing.
- Converts to WAV; chunk-based processing for long audio (60s chunks, 10s overlap).
- Real-time progress via `_update_job_status` and `get_segments_generator`.
- Diarization: tries PyAnnote; if unavailable, uses feature/rule-based fallbacks.
- Results in-memory: `jobs`, `results`, `segments_cache`, and `job_file_paths` for retranslation.

#### `SummaryService`

- Uses `LLMService` to generate a summary and extract topics.
- Tracks job status and results in-memory.

#### `ChatService`

- Wraps `LLMService.chat` with a transcript-aware system prompt.
- Returns assistant message, model used, and token usage.

#### `RetranslateService`

- Keeps a map of `job_id` → audio file path for full-audio segment extraction.
- Extracts a time range to WAV and runs `WhisperTranscriber` on the slice.

### Getting started (development)

#### Prerequisites

- Linux/macOS with Bash
- Python 3.12+
- Node.js (LTS) and npm
- curl (for uv installer)

#### 1) Clone the repo

```bash
git clone https://github.com/Sang-Buster/SaLED.git
cd SaLED
```

#### 2) Install dependencies

Use the Makefile helpers:

```bash
make install
# or
./run.sh install
```

This will:

- Backend: create/refresh a `uv` virtual environment and sync Python deps in `backend/saled`.
- Frontend: install npm packages in `frontend`.

Optional: install pre-commit hooks

```bash
uv pip install ruff pre-commit
pre-commit install
```

#### 3) Start development servers

```bash
make dev
# or
./run.sh dev
```

- Frontend: http://localhost:3000
- Backend (FastAPI docs): http://localhost:8000/docs

To run only one side:

```bash
make backend    # FastAPI only
make frontend   # Next.js only
```

#### 4) Verify health

- Visit http://localhost:8000/health (expect {"status":"healthy", ...}).
- Visit http://localhost:8000/ (service metadata and endpoints).
- Check http://localhost:8000/docs for interactive OpenAPI.

#### 5) First transcription

Use the API UI at http://localhost:8000/docs or curl:

```bash
curl -X POST "http://localhost:8000/api/transcribe/" \
  -F "file=@backend/saled/demo.wav" \
  -F "model_name=tiny.en" \
  -F "diarize=true"
```

Response contains `job_id`. Poll status:

```bash
curl "http://localhost:8000/api/transcribe/status/<job_id>"
```

Fetch result:

```bash
curl "http://localhost:8000/api/transcribe/result/<job_id>"
```

#### 6) Using the CLI (optional)

From `backend/saled`:

```bash
./cli.py --help
./cli.py model list
./cli.py model download tiny.en
./cli.py transcribe ../../demo.wav
```

#### Troubleshooting

- Port conflicts: run `make clean` to kill prior servers.
- Missing models: run `./cli.py model list` and `./cli.py model download <name>`.
- CORS or 500s: check backend logs; every response includes `X-Request-ID` to trace.
- Long audio: progress is chunked; for live updates, connect to WebSocket `/api/transcribe/live/{job_id}`.

### Adding a new API route

1. Create a router in `app/routers/<feature>.py` with Pydantic models.
2. Register it in `app/main.py` with `app.include_router`.
3. Implement logic in `core/services/<feature>_service.py`.
4. Add tests in `backend/saled/tests`.

### Extending transcription

- Models: integrate new Whisper variants by extending `WhisperTranscriber` or mapping in `MODEL_REPO_IDS`.
- Progress: emit granular messages via `_update_job_status`.
- Diarization: plug in better pipelines; ensure fallbacks remain robust.

### Frontend integration notes

- The UI expects REST endpoints at `/api/<feature>` and a WebSocket at `/api/transcribe/live/{job_id}`.
- CORS is permissive by default; tighten for production.

### Production considerations

- Persistence: move jobs/results from memory to a store (Redis/Postgres/S3 for blobs).
- Background workers: offload long jobs to a task queue (RQ/Celery/Arq) to isolate API.
- Rate limits/auth: introduce auth middleware and quotas.
- Observability: structure logs with `request_id`; export metrics.
- Model assets: pre-fetch and cache models using the CLI or at container build time.

### Testing and linting

- Tests live under `backend/saled/tests`.
- Lint: `make lint` runs frontend Prettier/ESLint and backend Ruff.
