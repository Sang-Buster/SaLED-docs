---
outline: deep
---

# API Reference

Base URL: `http://localhost:8000`

All responses include headers:

- `X-Request-ID`: unique ID for tracing
- `X-Process-Time-Ms`: end-to-end processing time for the request

### Health and root

- GET `/health` → `{ status, timestamp }`
- GET `/` → service metadata: name, version, endpoints

---

## Transcription API

Prefix: `/api/transcribe`

### List available models

GET `/api/transcribe/models`
Response:

```json
{
  "models": [
    {
      "name": "tiny.en",
      "full_name": "openai/whisper-tiny.en",
      "is_downloaded": true,
      "size_mb": 75.0,
      "description": "Fast, English optimized"
    }
  ]
}
```

### Start transcription

POST `/api/transcribe/`
Form fields:

- `file` (required): audio file (mp3, wav, m4a, ...)
- `model_name` (default: `tiny.en`)
- `language` (optional ISO 639-1)
- `diarize` (bool, default: true)

Response:

```json
{ "job_id": "<uuid>", "status": "processing", "message": "..." }
```

### List jobs

GET `/api/transcribe/jobs`
Response:

```json
{
  "jobs": [
    {
      "job_id": "...",
      "status": "processing",
      "progress": 25,
      "updated_at": 1712345678.9,
      "message": "..."
    }
  ],
  "count": 1
}
```

### Check status

GET `/api/transcribe/status/{job_id}`
Response (examples):

```json
{
  "job_id": "...",
  "status": "processing",
  "message": "Processing chunk 2/5 (40%)",
  "progress": 40,
  "updated_at": 1712345678.9
}
```

or if not found:

```json
{
  "job_id": "...",
  "status": "not_found",
  "message": "Transcription job not found or expired",
  "progress": 0,
  "updated_at": 1712345678.9
}
```

### Get result

GET `/api/transcribe/result/{job_id}`
Response:

```json
{
  "segments": [
    {
      "start": 0.12,
      "end": 2.34,
      "text": "hello",
      "speaker": "SPEAKER_1",
      "speaker_confidence": 0.78,
      "start_display": "00:00:00.120",
      "end_display": "00:00:02.340"
    }
  ],
  "text": "hello ...",
  "language": "en",
  "audio_duration": 123.45
}
```

### Live updates (WebSocket)

WS `/api/transcribe/live/{job_id}`
Messages:

- Status updates: `{ "type":"status", "status":"processing|completed|failed", "message":"...", "progress": 0-100, "chunk_info": {"current_chunk":N,"total_chunks":M,"chunk_progress":0-100} }`
- Segment objects as they are produced (silence segments are not sent)

### Debug a job

GET `/api/transcribe/debug/{job_id}` → diagnostic fields: cached segments, latest time, etc.

---

## Summary API

Prefix: `/api/summary`

### Start summary

POST `/api/summary/`
Body (JSON):

```json
{
  "transcript": [{ "start": 0.0, "end": 1.2, "text": "..." }],
  "full_text": "optional full transcript text",
  "model_name": "gpt-3.5-turbo",
  "max_length": 500,
  "format": "paragraph" // paragraph | bullet_points | key_points
}
```

Response: `{ "job_id": "<uuid>", "status": "processing", "message": "..." }`

### Get summary result

GET `/api/summary/{job_id}`
Response:

```json
{
  "summary": "...",
  "topics": ["..."],
  "length": 123,
  "model_used": "gpt-3.5-turbo"
}
```

### Check summary status

GET `/api/summary/status/{job_id}` → `{ status, message, progress }` or 404 if unknown.

---

## Chat API

Prefix: `/api/chat`

### List available chat models

GET `/api/chat/models`
Response:

```json
{
  "models": [{ "id": "gpt-3.5-turbo", "name": "GPT-3.5", "description": "..." }]
}
```

### Chat with transcript context

POST `/api/chat/`
Body (JSON):

```json
{
  "transcript": [{ "start": 0.0, "end": 1.2, "text": "..." }],
  "full_text": "optional full transcript text",
  "messages": [{ "role": "user", "content": "What did speaker 2 request?" }],
  "model_name": "gpt-3.5-turbo",
  "temperature": 0.7,
  "max_tokens": 500
}
```

Response:

```json
{
  "message": { "role": "assistant", "content": "..." },
  "model_used": "gpt-3.5-turbo",
  "usage": { "prompt": 123, "completion": 45, "total": 168 }
}
```

---

## Retranslation API

Prefix: `/api/retranslate`

### Reprocess a provided audio segment

POST `/api/retranslate/segment`
Form fields:

- `file` (required): clipped audio for the segment
- `segment_id` (required)
- `start_time` (float seconds)
- `end_time` (float seconds)
- `model_name` (default: `whisper-large-v3-turbo`)
- `language` (optional)
  Response:

```json
{
  "segment_id": "seg-1",
  "text": "...",
  "confidence": 0.95,
  "speaker": null,
  "model_used": "whisper-large-v3-turbo"
}
```

### Reprocess from previously uploaded full audio

POST `/api/retranslate/segment-from-full?job_id=<job_id>`
Body (JSON):

```json
{
  "segment_id": "seg-1",
  "start_time": 30.0,
  "end_time": 44.0,
  "model_name": "whisper-large-v3-turbo",
  "language": "en"
}
```

Response: same as above.

---

## Error handling

- 400: invalid input (e.g., file content-type not audio)
- 404: unknown `job_id`
- 500: unhandled errors; payload includes `detail` and responses still carry CORS headers
