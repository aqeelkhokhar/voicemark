/**
 * Voicemark UI copy library — locked in the project spec (Appendix D).
 * Screens use these keys, never literal strings.
 */

export const copy = {
  brand: {
    name: 'Voicemark',
    tagline: 'Speak. Reflect. Remember.',
  },

  today: {
    title: 'Voicemark',
    emptyHint: 'Tap to start your first reflection.',
    recentEntryPrefix: 'Last reflection · ',
    recordButtonLabel: 'Tap to record',
  },

  record: {
    listeningHint: 'Listening…',
    timerMaxDisplay: '5:00',
    stopButton: 'Stop',
    discardButton: 'Discard',
    permissionDeniedTitle: 'Microphone is off',
    permissionDeniedBody:
      'Voicemark needs the microphone to record your voice notes. Audio is processed on-device and never uploaded.',
    permissionDeniedCta: 'Open Settings',
  },

  review: {
    header: 'What you said',
    editHint: 'Edit anything you want. Reflection is optional.',
    reflectButton: 'Reflect on this',
    saveWithoutReflectionButton: 'Save without reflection',
  },

  reflection: {
    waitingState: 'Reflecting…',
    summaryHeading: 'Three things you said',
    followupHeading: 'Something to sit with',
    moodHeading: 'Mood',
    saveButton: 'Save entry',
    errorTitle: "Couldn't reach the AI",
    errorBody:
      'Your transcript is safe. You can save it now and reflect later.',
    errorCta: 'Save without reflection',
    parseError: 'Could not parse the AI response. Try again.',
  },

  history: {
    title: 'History',
    emptyTitle: 'Your reflections appear here.',
    emptyBody:
      'Start with a 2-minute voice note. Voicemark will help you read it back later.',
    dateGroupLabels: {
      today: 'Today',
      yesterday: 'Yesterday',
      earlierThisWeek: 'Earlier this week',
      earlier: 'Earlier',
    },
    deleteConfirm: 'Delete this entry? This cannot be undone.',
  },

  entryDetail: {
    transcriptToggleCollapsed: 'Show transcript',
    transcriptToggleExpanded: 'Hide transcript',
    deleteEntry: 'Delete entry',
  },

  settings: {
    title: 'Settings',
    aiProvider: {
      groupTitle: 'AI provider',
      keyFieldLabel: 'Gemini API key',
      groqKeyFieldLabel: 'Groq API key (optional)',
      keyFieldPlaceholder: 'Paste your key here',
      keyHelpLink: 'Get a free key from Google AI Studio',
      keyTestButton: 'Test connection',
      keyTestSuccess: 'Connected',
      keyTestFailure: 'Could not connect. Check the key.',
      saveKey: 'Save key',
      removeKey: 'Remove key',
      removeKeyConfirmTitle: 'Remove this key?',
      removeKeyConfirmBody:
        'Voicemark will no longer be able to reflect until you add a key again.',
      missingKeyBanner:
        'Reflection needs an API key. Paste your free Gemini key below.',
    },
    coachingStyle: {
      groupTitle: 'Coaching style',
      defaultStyle: 'Reflective (default)',
      stoic: 'Stoic',
      gratitude: 'Gratitude',
      comingSoon: 'Coming soon',
    },
    data: {
      groupTitle: 'Your data',
      clearAllEntries: 'Clear all entries',
      clearConfirmTitle: 'Delete every saved entry?',
      clearConfirmBody:
        'All transcripts and reflections will be removed from this device.',
      clearConfirmDestructiveCta: 'Delete everything',
    },
    about: {
      groupTitle: 'About',
      versionRow: 'Version',
      githubRow: 'Source on GitHub',
      privacyRow: 'Privacy',
    },
  },

  privacyModal: {
    title: 'Privacy in plain language',
    bullets: [
      'Your voice never leaves your phone. Speech-to-text runs on-device.',
      'Your transcript leaves your phone only when you tap Reflect, and only to the AI provider you connect (Google Gemini or Groq).',
      'Voicemark stores no analytics. There is no backend. There is no account.',
      'On the Gemini free tier, Google may use your transcript to improve their models. Use a paid Gemini account if this is unacceptable for your use case.',
    ],
    cta: 'Got it',
  },

  firstLaunchTooltip: {
    text: 'Hold or tap to record your first reflection. Two to five minutes is enough.',
    dismiss: 'Got it',
  },
} as const;

export type Copy = typeof copy;
