import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';
import { useCallback, useEffect, useRef, useState } from 'react';

export const MAX_RECORDING_SECONDS = 5 * 60;

export type RecordingStatus =
  | 'starting'
  | 'recording'
  | 'stopping'
  | 'denied'
  | 'error';

type UseRecordingArgs = {
  /** Called once the recognizer has fully stopped, with the final transcript. */
  onFinished: (transcript: string) => void;
};

export function useRecording({ onFinished }: UseRecordingArgs) {
  const [status, setStatus] = useState<RecordingStatus>('starting');
  const [transcript, setTranscript] = useState('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

  // finalizedRef holds segments the recognizer has marked final. displayRef
  // mirrors what's on screen: finalized text plus the current interim segment.
  // We hand displayRef (not just finalizedRef) to Review on stop, because
  // Android often never finalizes the last segment before recognition ends —
  // keeping only finalized text would discard short, still-interim speech.
  const finalizedRef = useRef('');
  const displayRef = useRef('');
  const discardedRef = useRef(false);
  const finishedRef = useRef(false);
  // Set when the recognizer reports a real failure, so the end event that
  // follows shows the error instead of silently navigating to an empty Review.
  const erroredRef = useRef(false);
  const onFinishedRef = useRef(onFinished);
  useEffect(() => {
    onFinishedRef.current = onFinished;
  });

  useSpeechRecognitionEvent('result', (event) => {
    const segment = event.results[0]?.transcript ?? '';
    if (event.isFinal) {
      finalizedRef.current = [finalizedRef.current, segment]
        .filter(Boolean)
        .join(' ');
      displayRef.current = finalizedRef.current;
    } else {
      displayRef.current = [finalizedRef.current, segment]
        .filter(Boolean)
        .join(' ');
    }
    setTranscript(displayRef.current);
  });

  useSpeechRecognitionEvent('start', () => setStatus('recording'));

  useSpeechRecognitionEvent('end', () => {
    if (discardedRef.current || finishedRef.current) return;
    // If we captured words, keep them even when an error also fired.
    if (displayRef.current.trim().length > 0) {
      finishedRef.current = true;
      onFinishedRef.current(displayRef.current.trim());
      return;
    }
    // Nothing captured. If a real error occurred, surface it instead of
    // navigating to an empty Review with no explanation.
    if (erroredRef.current) {
      setStatus('error');
      return;
    }
    finishedRef.current = true;
    onFinishedRef.current('');
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (event.error === 'aborted') return;
    if (
      event.error === 'not-allowed' ||
      event.error === 'service-not-allowed'
    ) {
      setStatus('denied');
      return;
    }
    erroredRef.current = true;
    setErrorDetail(`${event.error}: ${event.message}`);
  });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const existing = await ExpoSpeechRecognitionModule.getPermissionsAsync();
      const granted = existing.granted
        ? true
        : (await ExpoSpeechRecognitionModule.requestPermissionsAsync()).granted;
      if (cancelled) return;
      if (!granted) {
        setStatus('denied');
        return;
      }

      // No recognition service on the device → fail loudly, not silently.
      if (!ExpoSpeechRecognitionModule.isRecognitionAvailable()) {
        erroredRef.current = true;
        setErrorDetail(
          'No speech recognition service is available on this device.',
        );
        setStatus('error');
        return;
      }

      try {
        ExpoSpeechRecognitionModule.start({
          lang: 'en-US',
          interimResults: true,
          continuous: true,
          // Prefer Google's network recognizer when on-device models are
          // missing; this is what works out of the box on most Android phones.
          requiresOnDeviceRecognition: false,
        });
      } catch (e) {
        if (cancelled) return;
        erroredRef.current = true;
        setErrorDetail(
          `start failed: ${e instanceof Error ? e.message : String(e)}`,
        );
        setStatus('error');
      }
    })();

    return () => {
      cancelled = true;
      if (!finishedRef.current) {
        discardedRef.current = true;
        ExpoSpeechRecognitionModule.abort();
      }
    };
  }, []);

  const stop = useCallback(() => {
    setStatus('stopping');
    ExpoSpeechRecognitionModule.stop();
  }, []);

  const discard = useCallback(() => {
    discardedRef.current = true;
    ExpoSpeechRecognitionModule.abort();
  }, []);

  const elapsedRef = useRef(0);
  useEffect(() => {
    if (status !== 'recording') return;
    const interval = setInterval(() => {
      elapsedRef.current += 1;
      setElapsedSeconds(elapsedRef.current);
      // Hard cap from the spec: auto-stop at 5:00.
      if (elapsedRef.current >= MAX_RECORDING_SECONDS) {
        stop();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status, stop]);

  return { status, transcript, elapsedSeconds, errorDetail, stop, discard };
}

export function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
