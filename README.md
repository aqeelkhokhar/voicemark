# Voicemark

**Speak. Reflect. Remember.**

[![CI](https://github.com/aqeelkhokhar/voicemark/actions/workflows/ci.yml/badge.svg)](https://github.com/aqeelkhokhar/voicemark/actions/workflows/ci.yml)
![Platform](https://img.shields.io/badge/platform-Android-3ddc84)
![Expo](https://img.shields.io/badge/Expo-SDK%2056-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

Voicemark is a private voice journaling app. You speak a short reflection, the app transcribes it with your phone's built-in speech recognition, and Claude returns a calm three bullet summary, one follow up question worth sitting with, and a mood tag. Everything is stored on your phone. There is no account, no backend and no analytics.

<p align="center">
  <img src="docs/screenshots/home.png" width="260" alt="Voicemark home screen with a single tap to record button" />
  &nbsp;&nbsp;
  <img src="docs/screenshots/settings.png" width="260" alt="Settings screen with the Claude API key field, Gemini and Groq as optional alternatives" />
</p>

## Download

Grab the Android APK from the [latest release](https://github.com/aqeelkhokhar/voicemark/releases/latest), install it, then add your own Claude API key in Settings. The APK is signed with a debug key, so Android will ask you to allow installs from your browser or file manager.

## Features

- Voice journaling, hold or tap to record up to five minutes
- Native speech recognition, using the phone's built in recognizer and running on device when an offline model is installed
- AI reflection with a three bullet summary in your own voice
- One open ended follow up question per entry
- Mood tag from a fixed ten word vocabulary
- Fully local storage in SQLite on the device
- Bring your own API key, stored in the device's secure storage

## How it works

1. You record. Speech to text runs on the phone.
2. You review and edit the transcript.
3. You tap Reflect. Only then does the transcript go to your chosen AI provider, directly from the phone over HTTPS.
4. The response is validated before it is shown. It must be valid JSON with exactly three summary bullets, one follow up question and a mood from the fixed vocabulary. Anything else is rejected with a clear message instead of being shown half broken.
5. The entry is saved locally and appears in History.

The reflection call follows a fixed network policy. It times out after 30 seconds, retries once after two seconds on network errors, and never retries on a client error such as a bad key.

## Architecture

```
app/                    Expo Router screens, record, review, reflection, history, settings
src/features/
  recording/            speech recognition hook and draft handling
  reflection/           provider selection, retry policy and response validation
  journal/              history grouping and app settings
src/lib/
  ai/                   AiProvider interface with Claude, Gemini and Groq implementations
  db/                   SQLite storage
  secrets/              API keys in the device secure store
src/ui/                 theme and shared components
```

The AI layer is a single `AiProvider` interface. Claude is the primary provider. Gemini and Groq are optional alternatives, and the first provider that has a stored key is used. Adding another provider means one new file that implements the interface, plus a few small registrations for its key and its settings field.

## Privacy

- Your voice never leaves your phone through Voicemark. Speech to text uses the phone's built in recognizer. It runs on device when an offline speech model is installed, and otherwise the platform's speech service (Google on Android) may process the audio.
- Your transcript leaves your phone only when you tap Reflect, and only to the AI provider you connect (Anthropic Claude, with Google Gemini and Groq as optional alternatives).
- Voicemark stores no analytics. There is no backend and no account.
- Anthropic does not use API inputs to train its models by default. If you choose the Gemini free tier instead, Google may use your transcript to improve their models, so use a paid Gemini account if that is unacceptable for your use case.

## Get a Claude API key

Go to the [Anthropic Console](https://console.anthropic.com/settings/keys) and create an API key. Copy it and paste it into Voicemark's Settings, under AI provider. Use the Test connection button to confirm it works.

You pay Anthropic directly for what you use, and a single short reflection uses very little. If you prefer a free tier, you can add a Gemini or Groq key in the same screen instead.

## Run it locally

Voicemark uses native modules such as speech recognition, so it needs a development build and does not run in Expo Go.

```bash
# Requires Node 20 or newer, pnpm, and the Android SDK
pnpm install
pnpm android      # builds and installs a development build on a device or emulator
```

Other scripts

```bash
pnpm typecheck
pnpm lint
pnpm format:check
```

## Tech stack

Expo, React Native, TypeScript, Expo Router, expo-sqlite, expo-secure-store, expo-speech-recognition, Anthropic Claude API.

## Roadmap

The core loop of record, transcribe, reflect, save and read back is complete. Next on the list is a weekly digest, mood trend charts, audio playback, Markdown and PDF export, more coaching styles (Stoic and gratitude) and store distribution.

## License

[MIT](LICENSE)

## Author

Built by **Aqeel Ahmad**, Senior Mobile Engineer working in React Native and Flutter. I take on remote contracts and projects, and I am happy to walk through how Voicemark is built or discuss your own app.

- Portfolio https://aqeel-ahmad-portfolio.vercel.app/
- LinkedIn https://www.linkedin.com/in/aqeel-ahmad-mobile-engineer
- Email aqeelakash596@gmail.com
- WhatsApp +92 302 3376494
