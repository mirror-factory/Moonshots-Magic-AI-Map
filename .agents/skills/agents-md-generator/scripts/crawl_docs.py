#!/usr/bin/env python3
"""
Crawl a documentation site using Firecrawl and organize output for AGENTS.md compression.

Requires: pip install firecrawl-py

Usage:
    # Crawl Vercel AI SDK docs
    python crawl_docs.py https://sdk.vercel.ai/docs --output ./.ai-sdk-docs --label "Vercel AI SDK"

    # Crawl with depth limit
    python crawl_docs.py https://supabase.com/docs --output ./.supabase-docs --max-pages 200

    # Crawl and immediately generate compressed index
    python crawl_docs.py https://v3.tauri.app/docs --output ./.tauri-docs --compress
"""

import argparse
import os
import sys
import re
import json
from pathlib import Path
from urllib.parse import urlparse


def sanitize_filename(url_path: str) -> str:
    """Convert a URL path into a filesystem-safe path."""
    # Remove leading/trailing slashes
    path = url_path.strip("/")

    # Replace special characters
    path = re.sub(r"[?#&=]", "-", path)
    path = re.sub(r"[^\w\-./]", "-", path)
    path = re.sub(r"-+", "-", path)

    # Ensure it ends with .md
    if not path.endswith((".md", ".mdx")):
        path = path + ".md"

    return path


def organize_crawl_results(results: list[dict], output_dir: str, base_url: str) -> dict:
    """Organize crawl results into a directory structure matching the URL hierarchy."""
    os.makedirs(output_dir, exist_ok=True)

    parsed_base = urlparse(base_url)
    base_path = parsed_base.path.rstrip("/")

    stats = {"pages": 0, "total_bytes": 0, "errors": 0}

    for page in results:
        url = page.get("url", "") or page.get("sourceURL", "")
        content = page.get("markdown", "") or page.get("content", "")
        title = page.get("metadata", {}).get("title", "")

        if not url or not content:
            stats["errors"] += 1
            continue

        # Extract path relative to base URL
        parsed = urlparse(url)
        rel_path = parsed.path
        if rel_path.startswith(base_path):
            rel_path = rel_path[len(base_path):]

        filepath = sanitize_filename(rel_path)
        if not filepath or filepath == ".md":
            filepath = "index.md"

        full_path = os.path.join(output_dir, filepath)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)

        # Add frontmatter with source URL and title
        frontmatter = f"---\ntitle: \"{title}\"\nsource: {url}\n---\n\n"
        final_content = frontmatter + content

        with open(full_path, "w", encoding="utf-8") as f:
            f.write(final_content)

        stats["pages"] += 1
        stats["total_bytes"] += len(final_content.encode("utf-8"))

    return stats


def crawl_with_firecrawl(url: str, max_pages: int = 100, **kwargs) -> list[dict]:
    """Crawl a URL using Firecrawl and return results."""
    try:
        from firecrawl import FirecrawlApp
    except ImportError:
        print("❌ firecrawl-py not installed. Run: pip install firecrawl-py", file=sys.stderr)
        sys.exit(1)

    api_key = os.environ.get("FIRECRAWL_API_KEY")
    if not api_key:
        print("❌ FIRECRAWL_API_KEY environment variable not set", file=sys.stderr)
        sys.exit(1)

    app = FirecrawlApp(api_key=api_key)

    print(f"🔥 Crawling {url} (max {max_pages} pages)...")

    result = app.crawl_url(
        url,
        params={
            "limit": max_pages,
            "scrapeOptions": {
                "formats": ["markdown"],
            },
        },
        poll_interval=5,
    )

    # Handle different result formats
    if isinstance(result, dict):
        pages = result.get("data", [])
    elif isinstance(result, list):
        pages = result
    else:
        pages = []

    print(f"   Retrieved {len(pages)} pages")
    return pages


def main():
    parser = argparse.ArgumentParser(
        description="Crawl docs with Firecrawl and organize for AGENTS.md compression"
    )
    parser.add_argument("url", help="Documentation URL to crawl")
    parser.add_argument("--output", "-o", required=True, help="Output directory for organized docs")
    parser.add_argument("--label", "-l", default=None, help="Label for the docs section")
    parser.add_argument("--max-pages", type=int, default=100, help="Maximum pages to crawl (default: 100)")
    parser.add_argument(
        "--compress", action="store_true",
        help="Also generate compressed index after crawling"
    )
    parser.add_argument(
        "--from-json", metavar="FILE",
        help="Use existing Firecrawl JSON output instead of crawling"
    )

    args = parser.parse_args()
    label = args.label or urlparse(args.url).hostname or "Docs"

    # Get pages from Firecrawl or JSON
    if args.from_json:
        print(f"📄 Loading from {args.from_json}...")
        with open(args.from_json, "r") as f:
            data = json.load(f)
        pages = data if isinstance(data, list) else data.get("data", [])
        print(f"   Loaded {len(pages)} pages")
    else:
        pages = crawl_with_firecrawl(args.url, max_pages=args.max_pages)

    if not pages:
        print("❌ No pages retrieved", file=sys.stderr)
        sys.exit(1)

    # Organize into directory structure
    stats = organize_crawl_results(pages, args.output, args.url)
    print(f"\n📂 Organized {stats['pages']} pages into {args.output}")
    print(f"   Total content: {stats['total_bytes']/1024:.1f}KB")
    if stats["errors"]:
        print(f"   ⚠ {stats['errors']} pages skipped (no content)")

    # Optionally compress
    if args.compress:
        print(f"\n🗜  Compressing...")
        from compress_docs import compress_directory
        compressed, comp_stats = compress_directory(
            args.output, label, extract_titles=True
        )
        index_file = args.output.rstrip("/") + "-index.md"
        with open(index_file, "w") as f:
            f.write(compressed)

        ratio = comp_stats["compression_ratio"]
        comp_kb = comp_stats["compressed_size_bytes"] / 1024
        print(f"   Index: {comp_kb:.1f}KB ({ratio:.0f}% compression)")
        print(f"   Written to {index_file}")


if __name__ == "__main__":
    main()
