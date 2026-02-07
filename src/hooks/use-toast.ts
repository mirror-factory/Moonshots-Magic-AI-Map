/**
 * @module hooks/use-toast
 * Lightweight toast notification hook using a pub/sub pattern.
 * Provides `toast()` to enqueue notifications and `useToast()` to
 * consume them in a React component tree.
 */

"use client";

import { useEffect, useState } from "react";

/** Shape of a single toast notification. */
export interface Toast {
  /** Unique identifier for the toast instance. */
  id: string;
  /** Primary heading displayed in the toast. */
  title: string;
  /** Optional secondary text beneath the title. */
  description?: string;
  /** Variant controlling visual style. */
  variant?: "default" | "destructive";
}

/** Parameters accepted by the {@link toast} function. */
export type ToastInput = Omit<Toast, "id">;

type Listener = (toasts: Toast[]) => void;

let toasts: Toast[] = [];
const listeners = new Set<Listener>();
let idCounter = 0;

/**
 * Notify all subscribed listeners of the current toast state.
 */
function emit(): void {
  listeners.forEach((listener) => listener([...toasts]));
}

/**
 * Enqueue a new toast notification.
 * The toast auto-dismisses after 4 seconds.
 *
 * @param input - Toast content (title, optional description and variant).
 * @returns The generated toast with its unique ID.
 */
export function toast(input: ToastInput): Toast {
  const id = `toast-${++idCounter}`;
  const newToast: Toast = { ...input, id };
  toasts = [...toasts, newToast];
  emit();

  // Auto-dismiss after 4 seconds
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    emit();
  }, 4000);

  return newToast;
}

/**
 * React hook that subscribes to the toast notification state.
 * Returns the current list of active toasts and the {@link toast} dispatch function.
 *
 * @returns Object containing the active `toasts` array and the `toast` dispatcher.
 */
export function useToast(): { toasts: Toast[]; toast: typeof toast } {
  const [state, setState] = useState<Toast[]>([]);

  useEffect(() => {
    listeners.add(setState);
    return () => {
      listeners.delete(setState);
    };
  }, []);

  return { toasts: state, toast };
}
