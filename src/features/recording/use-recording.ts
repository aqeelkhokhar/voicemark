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

  // finalizedRef holds segments the recognizer has marked final. displayRef
  // mirrors what's on screen: finalized text plus the current interim segment.
  // We hand displayRef (not just finalizedRef) to Review on stop, because
  // Android often never finalizes the last segment before recognition ends —
  // keeping only finalized text would discard short, still-interim speech.
  const finalizedRef = useRef('');
  const displayRef = useRef('');
  const discardedRef = useRef(false);
  const finishedRef = useRef(false);
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
    finishedRef.current = true;
    onFinishedRef.current(displayRef.current.trim());
  });

  useSpeechRecognitionEvent('error', (event) => {
    if (event.error === 'aborted') return;
    if (event.error === 'not-allowed') {
      setStatus('denied');
      return;
    }
    // 'no-speech' and friends still emit 'end', which finalizes whatever we have.
    if (event.error !== 'no-speech' && event.error !== 'speech-timeout') {
      setStatus('error');
    }
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
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        continuous: true,
      });
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

  return { status, transcript, elapsedSeconds, stop, discard };
}

export function formatTimer(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}
