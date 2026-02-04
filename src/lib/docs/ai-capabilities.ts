/**
 * @module lib/docs/ai-capabilities
 * Utility functions for reading AI capabilities documentation from markdown files.
 * Used by the `/docs/ai` pages to render documentation with frontmatter metadata.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";

/** Directory containing AI capabilities markdown files. */
const DOCS_DIR = path.join(process.cwd(), "docs", "ai-capabilities");

/** Frontmatter metadata for an AI capability doc. */
export interface CapabilityMeta {
  slug: string;
  title: string;
  description: string;
  type?: "server" | "client";
}

/** Full capability doc including parsed body content. */
export interface Capability extends CapabilityMeta {
  body: string;
}

/**
 * Get all capability slugs for static generation.
 * @returns Array of slug strings (filename without .md extension)
 */
export function getAllCapabilitySlugs(): string[] {
  const files = fs.readdirSync(DOCS_DIR);
  return files
    .filter((file) => file.endsWith(".md") && file !== "index.md")
    .map((file) => file.replace(/\.md$/, ""));
}

/**
 * Get metadata for all capabilities (for index page listing).
 * @returns Array of capability metadata objects
 */
export function getAllCapabilities(): CapabilityMeta[] {
  const slugs = getAllCapabilitySlugs();
  return slugs.map((slug) => {
    const filePath = path.join(DOCS_DIR, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      slug,
      title: data.title || slug,
      description: data.description || "",
      type: data.type,
    };
  });
}

/**
 * Get a single capability by slug with full body content.
 * @param slug - The capability slug (filename without .md)
 * @returns Full capability object or null if not found
 */
export function getCapability(slug: string): Capability | null {
  const filePath = path.join(DOCS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    type: data.type,
    body: content,
  };
}

/**
 * Get the index/overview document.
 * @returns Capability object for the index page
 */
export function getIndexDoc(): Capability {
  const filePath = path.join(DOCS_DIR, "index.md");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  return {
    slug: "index",
    title: data.title || "AI Capabilities",
    description: data.description || "",
    body: content,
  };
}
