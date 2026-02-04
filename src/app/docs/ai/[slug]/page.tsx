/**
 * @module app/docs/ai/[slug]/page
 * Dynamic page for individual AI capability documentation.
 * Renders markdown content with syntax highlighting for code blocks.
 */

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCapabilitySlugs,
  getCapability,
} from "@/lib/docs/ai-capabilities";
import { ArrowLeft, Server, Monitor } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Generate static params for all capability pages. */
export async function generateStaticParams() {
  const slugs = getAllCapabilitySlugs();
  return slugs.map((slug) => ({ slug }));
}

/** Generate metadata for capability page. */
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const capability = getCapability(slug);
  if (!capability) return { title: "Not Found" };

  return {
    title: `${capability.title} | AI Capabilities`,
    description: capability.description,
  };
}

/** Capability detail page with rendered markdown. */
export default async function CapabilityPage({ params }: PageProps) {
  const { slug } = await params;
  const capability = getCapability(slug);

  if (!capability) {
    notFound();
  }

  // Simple markdown to HTML conversion
  const contentHtml = markdownToHtml(capability.body);

  return (
    <article className="space-y-6">
      {/* Back link */}
      <Link
        href="/docs/ai"
        className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-text transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to overview
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              capability.type === "client"
                ? "bg-blue-500/10 text-blue-400"
                : "bg-green-500/10 text-green-400"
            }`}
          >
            {capability.type === "client" ? (
              <Monitor className="h-5 w-5" />
            ) : (
              <Server className="h-5 w-5" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">{capability.title}</h1>
            <span className="text-xs uppercase tracking-wide text-text-muted">
              {capability.type === "client" ? "Client-side tool" : "Server-side tool"}
            </span>
          </div>
        </div>
        <p className="text-lg text-text-dim">{capability.description}</p>
      </header>

      {/* Content */}
      <div
        className="prose prose-sm max-w-none
          prose-headings:text-text prose-headings:font-semibold
          prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4
          prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
          prose-p:text-text-dim prose-p:leading-relaxed
          prose-strong:text-text prose-strong:font-semibold
          prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
          prose-code:text-brand-primary prose-code:bg-surface-2 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-code:before:content-[''] prose-code:after:content-['']
          prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:p-4
          prose-pre:overflow-x-auto
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-surface-2 prose-th:text-text prose-th:text-left prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-border prose-th:text-sm prose-th:font-semibold
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border prose-td:text-sm prose-td:text-text-dim
          prose-ul:text-text-dim prose-ul:space-y-1
          prose-li:text-text-dim"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}

/**
 * Convert markdown to HTML with basic formatting.
 * Handles headers, code blocks, tables, lists, and inline formatting.
 */
function markdownToHtml(markdown: string): string {
  let html = markdown;

  // Remove the first h1 (we render it separately)
  html = html.replace(/^# .+\n/, "");

  // Code blocks (fenced with ```)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, lang, code) =>
      `<pre><code class="language-${lang || "text"}">${escapeHtml(code.trim())}</code></pre>`
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  // Bold
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Tables
  html = html.replace(
    /^\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/gm,
    (_, headerRow, bodyRows) => {
      const headers = headerRow
        .split("|")
        .filter(Boolean)
        .map((h: string) => `<th>${h.trim()}</th>`)
        .join("");
      const rows = bodyRows
        .trim()
        .split("\n")
        .map((row: string) => {
          const cells = row
            .split("|")
            .filter(Boolean)
            .map((c: string) => `<td>${c.trim()}</td>`)
            .join("");
          return `<tr>${cells}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`;
    }
  );

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.+<\/li>\n?)+/g, "<ul>$&</ul>");

  // Paragraphs (lines that aren't already wrapped)
  html = html
    .split("\n\n")
    .map((block) => {
      if (
        block.startsWith("<") ||
        block.startsWith("```") ||
        block.trim() === ""
      ) {
        return block;
      }
      return `<p>${block.replace(/\n/g, " ")}</p>`;
    })
    .join("\n");

  return html;
}

/** Escape HTML entities in code blocks. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
