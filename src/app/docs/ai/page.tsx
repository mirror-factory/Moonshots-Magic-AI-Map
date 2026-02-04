/**
 * @module app/docs/ai/page
 * AI capabilities documentation index page.
 * Lists all available AI tools with links to detailed documentation.
 */

import Link from "next/link";
import { getAllCapabilities, getIndexDoc } from "@/lib/docs/ai-capabilities";
import { Server, Monitor, ArrowRight } from "lucide-react";

/** AI docs index page listing all capabilities. */
export default function AIDocsPage() {
  const capabilities = getAllCapabilities();
  const indexDoc = getIndexDoc();

  // Simple markdown to HTML for the overview
  const overviewHtml = indexDoc.body
    .split("\n\n")
    .slice(0, 3)
    .join("\n\n")
    .replace(/^# .+\n/, "")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="bg-surface-2 px-1 py-0.5 rounded text-sm">$1</code>');

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text">
          {indexDoc.title}
        </h1>
        <p className="mt-2 text-lg text-text-dim">{indexDoc.description}</p>
      </div>

      {/* Overview */}
      <div
        className="prose prose-sm max-w-none text-text-dim [&_strong]:text-text [&_code]:text-brand-primary"
        dangerouslySetInnerHTML={{ __html: overviewHtml }}
      />

      {/* Tools grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold text-text">Available Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {capabilities.map((cap) => (
            <Link
              key={cap.slug}
              href={`/docs/ai/${cap.slug}`}
              className="group flex flex-col rounded-xl border border-border bg-surface p-5 transition-all hover:border-brand-primary/30 hover:bg-surface-2"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    cap.type === "client"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {cap.type === "client" ? (
                    <Monitor className="h-4 w-4" />
                  ) : (
                    <Server className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text group-hover:text-brand-primary transition-colors">
                    {cap.title}
                  </h3>
                  <span className="text-xs uppercase tracking-wide text-text-muted">
                    {cap.type === "client" ? "Client-side" : "Server-side"}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
              <p className="mt-3 text-sm text-text-dim line-clamp-2">
                {cap.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="lg:hidden">
        <h2 className="mb-4 text-xl font-semibold text-text">Quick Links</h2>
        <ul className="space-y-2">
          {capabilities.map((cap) => (
            <li key={cap.slug}>
              <Link
                href={`/docs/ai/${cap.slug}`}
                className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
              >
                <ArrowRight className="h-3 w-3" />
                {cap.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
