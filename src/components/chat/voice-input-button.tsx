/**
 * @module components/chat/voice-input-button
 * Microphone button for voice input to the chat interface.
 * Uses Web Speech API for speech-to-text transcription.
 */

"use client";

import { useState, useCallback } from "react";
import { motion } from "motion/react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  startListening,
  stopListening,
  isCurrentlyListening,
  isSpeechRecognitionSupported,
} from "@/lib/voice/speech-to-text";

interface VoiceInputButtonProps {
  /** Callback when speech is transcribed. */
  onTranscript: (text: string) => void;
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Optional className for styling. */
  className?: string;
}

/**
 * Microphone button that captures voice input and transcribes it to text.
 * Shows recording animation when active.
 */
export function VoiceInputButton({
  onTranscript,
  disabled = false,
  className,
}: VoiceInputButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported] = useState(() => isSpeechRecognitionSupported());

  const handleToggle = useCallback(() => {
    if (isCurrentlyListening()) {
      stopListening();
      setIsRecording(false);
    } else {
      const started = startListening(
        (text) => {
          onTranscript(text);
          setIsRecording(false);
        },
        () => setIsRecording(false),
        (error) => {
          console.error("Speech recognition error:", error);
          setIsRecording(false);
        }
      );
      if (started) {
        setIsRecording(true);
      }
    }
  }, [onTranscript]);

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={disabled}
      className={className}
      title={isRecording ? "Stop recording" : "Start voice input"}
    >
      <div className="relative">
        {isRecording ? (
          <>
            {/* Pulsing ring animation */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--brand-primary)" }}
              initial={{ scale: 1, opacity: 0.3 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.3,
              }}
            />
            <MicOff
              className="relative h-4 w-4"
              style={{ color: "var(--brand-primary)" }}
            />
          </>
        ) : (
          <Mic className="h-4 w-4" style={{ color: "var(--text-dim)" }} />
        )}
      </div>
    </Button>
  );
}
