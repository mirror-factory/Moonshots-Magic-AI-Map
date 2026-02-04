#!/usr/bin/env python3
"""
Compress a documentation directory into pipe-delimited AGENTS.md format.

Designed to work with Firecrawl output or any structured docs directory.
Can be used standalone or as part of the full generate_agents_md.py workflow.

Usage:
    # Compress Firecrawl output
    python compress_docs.py ./.ai-sdk-docs "Vercel AI SDK" --output compressed-index.md

    # Compress with metadata extraction (reads frontmatter/titles from .md/.mdx files)
    python compress_docs.py ./.next-docs "Next.js 16 Docs" --extract-titles

    # Preview compression ratio without writing
    python compress_docs.py ./docs "My Docs" --dry-run
"""

import argparse
import os
import sys
import re
from pathlib import Path


def extract_title(filepath: str) -> str:
    """Extract title from markdown file frontmatter or first heading."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read(2048)  # Only read beginning
    except Exception:
        return ""

    # Try frontmatter title
    if content.startswith("---"):
        parts = content.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].strip().split("\n"):
                if line.strip().startswith("title:"):
                    title = line.split(":", 1)[1].strip().strip("'\"")
                    return title

    # Try first heading
    for line in content.split("\n"):
        match = re.match(r"^#+\s+(.+)", line)
        if match:
            return match.group(1).strip()

    return ""


def get_file_sizes(dirpath: str) -> dict:
    """Get sizes of all files in directory."""
    sizes = {}
    for root, dirs, files in os.walk(dirpath):
        dirs[:] = [d for d in dirs if not d.startswith(".")]
        for f in files:
            if f.startswith("."):
                continue
            fp = os.path.join(root, f)
            rel = os.path.relpath(fp, dirpath)
            sizes[rel] = os.path.getsize(fp)
    return sizes


def compress_directory(
    docs_dir: str,
    label: str,
    extract_titles: bool = False,
    include_sizes: bool = False,
) -> tuple[str, dict]:
    """Compress a docs directory into pipe-delimited index format.

    Returns:
        tuple: (compressed_content, stats_dict)
    """
    if not os.path.isdir(docs_dir):
        return f"# ⚠ Directory not found: {docs_dir}", {"error": True}

    lines = []
    lines.append(f"[{label}]|root: {docs_dir}")
    lines.append(
        f"|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any {label} tasks."
    )

    # Collect directory structure
    dir_entries: dict[str, list[str]] = {}
    title_map: dict[str, str] = {}

    for root, dirs, files in os.walk(docs_dir):
        dirs[:] = sorted([d for d in dirs if not d.startswith(".")])
        rel_root = os.path.relpath(root, docs_dir)
        if rel_root == ".":
            rel_root = ""

        doc_files = sorted([f for f in files if not f.startswith(".")])
        if not doc_files:
            continue

        dir_entries[rel_root] = doc_files

        if extract_titles:
            for f in doc_files:
                if f.endswith((".md", ".mdx")):
                    fp = os.path.join(root, f)
                    title = extract_title(fp)
                    if title:
                        rel_path = os.path.join(rel_root, f) if rel_root else f
                        title_map[rel_path] = title

    # Build compressed index
    for dir_path in sorted(dir_entries.keys()):
        files = dir_entries[dir_path]

        if extract_titles:
            # Include titles inline: {file.md:Title,file2.md:Title2}
            parts = []
            for f in files:
                rel = os.path.join(dir_path, f) if dir_path else f
                title = title_map.get(rel, "")
                if title:
                    # Truncate long titles
                    title_short = title[:50] + "…" if len(title) > 50 else title
                    parts.append(f"{f}:{title_short}")
                else:
                    parts.append(f)
            file_list = ",".join(parts)
        else:
            file_list = ",".join(files)

        key = dir_path if dir_path else "root"
        lines.append(f"|{key}:{{{file_list}}}")

    compressed = "\n".join(lines)

    # Calculate stats
    full_size = sum(
        os.path.getsize(os.path.join(root, f))
        for root, dirs, files in os.walk(docs_dir)
        for f in files
        if not f.startswith(".")
    )
    compressed_size = len(compressed.encode("utf-8"))
    file_count = sum(len(v) for v in dir_entries.values())
    dir_count = len(dir_entries)

    stats = {
        "full_size_bytes": full_size,
        "compressed_size_bytes": compressed_size,
        "compression_ratio": (1 - compressed_size / full_size) * 100 if full_size > 0 else 0,
        "file_count": file_count,
        "dir_count": dir_count,
    }

    return compressed, stats


def main():
    parser = argparse.ArgumentParser(
        description="Compress documentation directory into AGENTS.md index format"
    )
    parser.add_argument("docs_dir", help="Path to documentation directory")
    parser.add_argument("label", help="Label for this docs section (e.g. 'Next.js 16 Docs')")
    parser.add_argument("--output", "-o", help="Output file (default: stdout)")
    parser.add_argument(
        "--extract-titles", action="store_true",
        help="Extract titles from markdown frontmatter/headings"
    )
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Show compression stats without writing output"
    )

    args = parser.parse_args()

    compressed, stats = compress_directory(
        args.docs_dir, args.label,
        extract_titles=args.extract_titles,
    )

    if "error" in stats:
        print(compressed, file=sys.stderr)
        sys.exit(1)

    # Print stats
    full_kb = stats["full_size_bytes"] / 1024
    comp_kb = stats["compressed_size_bytes"] / 1024
    ratio = stats["compression_ratio"]

    print(f"📊 Compression Results for '{args.label}':", file=sys.stderr)
    print(f"   Source:      {full_kb:.1f}KB ({stats['file_count']} files in {stats['dir_count']} dirs)", file=sys.stderr)
    print(f"   Index:       {comp_kb:.1f}KB", file=sys.stderr)
    print(f"   Compression: {ratio:.0f}% reduction", file=sys.stderr)

    if args.dry_run:
        print(f"\n   [Dry run - no output written]", file=sys.stderr)
        return

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            f.write(compressed)
        print(f"\n✅ Written to {args.output}", file=sys.stderr)
    else:
        print(compressed)


if __name__ == "__main__":
    main()
