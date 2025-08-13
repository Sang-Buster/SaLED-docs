---
outline: deep
---

# SaLED: Speech and Language Editor

SaLED (Speech and Language Editor) is a full-stack application for working with spoken content. It lets you transcribe audio with speaker diarization, summarize long conversations, chat with the transcript using an LLM, and selectively reprocess segments when you need higher accuracy.

### What SaLED does

- Transcription: Upload audio and get a timestamped transcript with speakers. Progress is streamed in real-time over WebSocket.
- Summarization: Turn long transcripts into concise summaries with key topics.
- Chat: Ask questions about the transcript; the assistant answers grounded in the provided text.
- Retranslation: Reprocess specific time ranges with a chosen Whisper model for improved accuracy.

### How it’s built

- Backend: FastAPI service (`backend/saled`) exposing REST and WebSocket endpoints. Core logic lives in `saled/core/services/*`.
- Models: Local Whisper-based transcription via `WhisperTranscriber` and LLM-backed summary/chat via `LLMService`.
- Frontend: Next.js app (`frontend`) providing a modern audio editor UI with panels for transcript, summary, chat, waveform, and controls.

### Key capabilities at a glance

- Speaker diarization with resilient fallbacks when heavy diarization models are not available.
- Chunked processing for long audio with incremental progress.
- CORS-enabled API with per-request IDs and processing-time headers.
- Local model management through a CLI for listing, downloading, updating, and deleting Whisper models.

### Typical workflow

1. Upload audio to transcribe and watch status live.
2. Explore the transcript; fix tricky regions using Retranslation.
3. Generate summaries tailored to your preferred format.
4. Ask questions or extract insights via Chat.

### When to use SaLED

- Interviews, meetings, lectures, ATC/operations audio, or any speech where timestamps and speakers matter.
- Teams needing on-device or local-first workflows for privacy and control.

For setup and usage, see `user-guide.md`. For development setup, implementation details, and APIs, see `developer-guide.md` and `api-reference.md`.
