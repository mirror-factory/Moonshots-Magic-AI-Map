/**
 * @module instrumentation
 * Next.js instrumentation hook. Registers the AI SDK gateway as the default provider.
 */

import { gateway } from "@ai-sdk/gateway";

globalThis.AI_SDK_DEFAULT_PROVIDER = gateway;

/** Registers instrumentation hooks at server startup. */
export function register() {}
