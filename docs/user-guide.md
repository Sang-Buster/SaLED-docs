---
outline: deep
---

# User Guide

This guide walks through common tasks in the SaLED UI and with the API.

### Upload and transcribe audio

1. Open the app at http://localhost:3000.
2. Use the transcription panel to select an audio file (MP3/WAV/M4A).
3. Choose a Whisper model (start with `tiny.en` for speed, larger models for quality).
4. Enable/disable speaker diarization as needed.
5. Start. Watch progress indicators; segments appear incrementally.

Tips:

- For long files, processing is chunked; progress may advance in bursts.
- If diarization is off, SaLED applies a rule-based fallback to label speakers.

### Inspect and navigate transcripts

- Use the waveform and minimap to jump to timestamps.
- The transcript panel shows segments with speaker, start/end, and text.
- Use zoom and playback controls to verify accuracy.

### Fix tricky regions with Retranslation

If a region is inaccurate:

1. Note the `start_time` and `end_time` of the problematic span.
2. Reprocess just that portion with `/api/retranslate/segment` by uploading a clipped audio file; or
3. If the original full audio was uploaded for the same job, call `/api/retranslate/segment-from-full?job_id=<job_id>` with the time range and model.
4. Replace or merge the corrected text in your transcript.

When to escalate model size:

- Background noise, overlapping speakers, or domain-specific jargon.
- Try `small.en` → `medium.en` → `large-v3(-turbo)` as needed.

### Summarize a transcript

1. After transcription, send segments to `/api/summary/` with an optional `full_text`.
2. Pick `format`: `paragraph`, `bullet_points`, or `key_points`.
3. Poll `/api/summary/status/{job_id}` and fetch `/api/summary/{job_id}` for the final summary and topics.

Good prompts for summaries:

- Paragraph: broad narrative overview.
- Bullet points: meeting notes or action items.
- Key points: highlights for quick scan.

### Chat about the transcript

1. Compose a `messages` array with chat history and send along `transcript`/`full_text` to `/api/chat/`.
2. Adjust `temperature` (0.0–1.0) for creativity vs. determinism.
3. Respect token limits with `max_tokens` for concise answers.

Best practices:

- Ask grounded questions (“What did Speaker 2 request after …?”).
- Provide `full_text` if possible; it reduces reconstruction overhead.

### Managing Whisper models locally (CLI)

From `backend/saled`:

```bash
./cli.py model list
./cli.py model download base.en
./cli.py model delete base.en
./cli.py model update
```

### Keyboard/UX tips

- Use the minimap to scroll large transcripts quickly.
- Toggle diarization for simpler single-speaker content.
- Save versions of transcripts before heavy edits.
