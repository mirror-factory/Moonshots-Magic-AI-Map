/**
 * @module app/docs/ai/layout
 * Layout for AI capabilities documentation pages.
 * Provides consistent styling and navigation sidebar.
 */

import type { ReactNode } from "react";
import Link from "next/link";
import { getAllCapabilities } from "@/lib/docs/ai-capabilities";
import { ArrowLeft, Bot, Server, Monitor } from "lucide-react";

interface DocsLayoutProps {
  children: ReactNode;
}

/** Docs layout with navigation sidebar. */
export default function DocsLayout({ children }: DocsLayoutProps) {
  const capabilities = getAllCapabilities();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-text-dim hover:text-text transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Map
          </Link>
          <div className="h-4 w-px bg-border" />
          <Link
            href="/docs/ai"
            className="flex items-center gap-2 font-medium text-text"
          >
            <Bot className="h-4 w-4 text-brand-primary" />
            AI Capabilities
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <nav className="sticky top-24">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-text-dim">
                Tools
              </h3>
              <ul className="space-y-1">
                {capabilities.map((cap) => (
                  <li key={cap.slug}>
                    <Link
                      href={`/docs/ai/${cap.slug}`}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text-dim hover:bg-surface-2 hover:text-text transition-colors"
                    >
                      {cap.type === "client" ? (
                        <Monitor className="h-3.5 w-3.5 text-blue-400" />
                      ) : (
                        <Server className="h-3.5 w-3.5 text-green-400" />
                      )}
                      {cap.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
