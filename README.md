# Voicemark

**Speak. Reflect. Remember.**

<!-- Hero image: Reflection screen screenshot (Phase 5) -->

<!-- 60-second demo video (Phase 5) -->

Voicemark is a private voice journaling app. You speak a short reflection, the app transcribes it on-device, and a free-tier LLM returns a calm three-bullet summary, one follow-up question worth sitting with, and a mood tag. Everything is stored locally on your phone — no account, no backend, no analytics.

## Features

- Voice journaling — hold or tap to record up to five minutes
- On-device transcription (native speech recognition, never uploaded)
- AI reflection: three-bullet summary in your own voice
- One open-ended follow-up question per entry
- Mood tag from a fixed ten-word vocabulary
- Fully local storage (SQLite on device)
- Bring your own API key — your key, your quota, stored in secure storage

## Screenshots

<!-- Three side-by-side screenshots (Phase 5) -->

## Privacy commitments

- Your voice never leaves your phone. Speech-to-text runs on-device.
- Your transcript leaves your phone only when you tap Reflect, and only to the AI provider you connect (Google Gemini or Groq).
- Voicemark stores no analytics. There is no backend. There is no account.
- On the Gemini free tier, Google may use your transcript to improve their models. Use a paid Gemini account if this is unacceptable for your use case.

## How to use

1. Install the APK from the latest [Release](../../releases) <!-- APK attached from v0.5.0 (Phase 5) -->
2. Paste your Gemini API key in Settings
3. Hold to record

## Get a free Gemini API key

Go to [Google AI Studio](https://aistudio.google.com/apikey) and sign in with a Google account.
Create an API key, copy it, and paste it into Voicemark's Settings → AI provider.

## Run it locally

```bash
# Requires Node 20 and pnpm
pnpm install
pnpm dev
```

Then open Expo Go on your device and scan the QR code.

## Tech stack

Expo · React Native · TypeScript · expo-sqlite · expo-secure-store · expo-speech-recognition · Google Gemini API

## Roadmap

The MVP loop — record, transcribe on-device, reflect, save, read back — is feature-complete. The post-MVP backlog includes weekly digests, mood trend charts, audio playback, Markdown/PDF export, additional coaching styles (Stoic, gratitude), and store distribution.

## License

[MIT](LICENSE)

## Author

**Aqeel Ahmad** — Senior Mobile Engineer

- GitHub: [@aqeelkhokhar](https://github.com/aqeelkhokhar)
- LinkedIn: <!-- link (Phase 5) -->
- Build write-up on Medium: <!-- link (Phase 5) -->
