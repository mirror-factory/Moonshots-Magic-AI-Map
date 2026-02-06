/**
 * @module lib/voice/speech-to-text
 * Speech recognition using the Web Speech API.
 * Provides voice input for the chat interface.
 */

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionInterface extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInterface;
}

/** Speech recognition instance. */
let recognition: SpeechRecognitionInterface | null = null;

/** Whether recognition is currently active. */
let isListening = false;

/** Callback for when speech is recognized. */
let onResultCallback: ((text: string) => void) | null = null;

/** Callback for when recognition ends. */
let onEndCallback: (() => void) | null = null;

/** Callback for errors. */
let onErrorCallback: ((error: string) => void) | null = null;

/**
 * Checks if speech recognition is supported.
 * @returns True if Web Speech API is available.
 */
export function isSpeechRecognitionSupported(): boolean {
  return "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
}

/**
 * Gets or creates the speech recognition instance.
 * @returns SpeechRecognition instance or null if not supported.
 */
function getRecognition(): SpeechRecognitionInterface | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  if (!recognition) {
    const SpeechRecognitionClass = (
      window.SpeechRecognition || window.webkitSpeechRecognition
    ) as SpeechRecognitionConstructor;
    recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const result = event.results[last];

      if (result.isFinal && onResultCallback) {
        onResultCallback(result[0].transcript);
      }
    };

    recognition.onend = () => {
      isListening = false;
      onEndCallback?.();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      isListening = false;
      onErrorCallback?.(event.error);
    };
  }

  return recognition;
}

/**
 * Starts listening for speech input.
 * @param onResult - Callback when speech is recognized.
 * @param onEnd - Optional callback when listening ends.
 * @param onError - Optional callback for errors.
 * @returns True if listening started successfully.
 */
export function startListening(
  onResult: (text: string) => void,
  onEnd?: () => void,
  onError?: (error: string) => void
): boolean {
  const rec = getRecognition();
  if (!rec) {
    onError?.("Speech recognition not supported");
    return false;
  }

  if (isListening) {
    return true;
  }

  onResultCallback = onResult;
  onEndCallback = onEnd || null;
  onErrorCallback = onError || null;

  try {
    rec.start();
    isListening = true;
    return true;
  } catch (error) {
    console.error("Failed to start speech recognition:", error);
    onError?.("Failed to start recognition");
    return false;
  }
}

/**
 * Stops listening for speech input.
 */
export function stopListening(): void {
  if (recognition && isListening) {
    try {
      recognition.stop();
    } catch {
      // Already stopped
    }
  }
  isListening = false;
}

/**
 * Checks if currently listening.
 * @returns True if recognition is active.
 */
export function isCurrentlyListening(): boolean {
  return isListening;
}

/**
 * Aborts speech recognition immediately.
 */
export function abortListening(): void {
  if (recognition) {
    try {
      recognition.abort();
    } catch {
      // Already aborted
    }
  }
  isListening = false;
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}
