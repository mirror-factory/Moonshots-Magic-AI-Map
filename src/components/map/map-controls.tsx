/**
 * @module components/map/map-controls
 * Top-left map overlay with static brand logo.
 */

"use client";

import Image from "next/image";

/** Static brand logo overlay. */
export function MapControls() {
  return (
    <div className="absolute left-4 top-6 z-20 flex items-center gap-2">
      <div className="flex items-center gap-2 px-2 py-1">
        <div className="relative">
          <Image
            src="/mm-logo-dark.svg"
            alt="Moonshots & Magic"
            width={160}
            height={48}
            className="hidden h-12 w-auto dark:block"
            priority
          />
          <Image
            src="/mm-logo-light.svg"
            alt="Moonshots & Magic"
            width={160}
            height={48}
            className="block h-12 w-auto dark:hidden"
            priority
          />
        </div>
      </div>
    </div>
  );
}
