/**
 * @module components/chat/newsletter-card
 * Renders a list of newsletter search results in the chat panel.
 * Each item shows category, source, title, summary, author, and date.
 */

"use client";

import { Badge } from "@/components/ui/badge";

interface NewsletterItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  author?: string;
  publishedAt: string;
  tags: string[];
}

interface NewsletterCardProps {
  items: NewsletterItem[];
}

/** Renders a list of newsletter search results in the chat. */
export function NewsletterCard({ items }: NewsletterCardProps) {
  if (!items.length) {
    return (
      <p className="text-xs" style={{ color: "var(--text-dim)" }}>
        No newsletter results found.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const date = new Date(item.publishedAt);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        return (
          <div
            key={item.id}
            className="rounded-lg border p-3"
            style={{
              background: "var(--surface-2)",
              borderColor: "var(--border-color)",
            }}
          >
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs capitalize">
                {item.category}
              </Badge>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {item.source}
              </span>
            </div>
            <h4 className="oswald-h4 mb-1 text-sm" style={{ color: "var(--text)" }}>
              {item.title}
            </h4>
            <p className="line-clamp-2 text-xs" style={{ color: "var(--text-dim)" }}>
              {item.summary}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
              {item.author && <span>{item.author}</span>}
              <span>{dateStr}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
