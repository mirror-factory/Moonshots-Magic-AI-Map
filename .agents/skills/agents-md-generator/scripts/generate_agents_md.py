#!/usr/bin/env python3
"""
Generate AGENTS.md / CLAUDE.md with compressed indexes for skills and documentation.

Scans skill directories, documentation folders (e.g. from Firecrawl), and project
structure to produce a single context file using pipe-delimited compression.

Usage:
    python generate_agents_md.py \
        --output AGENTS.md \
        --skills-dir ./skills \
        --docs-dir ./.next-docs "Next.js Docs" \
        --docs-dir ./.ai-sdk-docs "Vercel AI SDK Docs" \
        --project-instructions "Use TypeScript strict mode" \
        --format agents  # or "claude" for CLAUDE.md format
"""

import argparse
import os
import sys
import yaml
import json
from pathlib import Path
from typing import Optional


def parse_frontmatter(filepath: str) -> dict:
    """Extract YAML frontmatter from a SKILL.md file."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return {}

    if not content.startswith("---"):
        return {}

    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}

    try:
        return yaml.safe_load(parts[1]) or {}
    except Exception:
        return {}


def get_dir_tree(dirpath: str, indent: int = 0, max_depth: int = 3) -> list[str]:
    """Get a compact directory tree listing."""
    lines = []
    if indent >= max_depth:
        return lines

    try:
        entries = sorted(os.listdir(dirpath))
    except PermissionError:
        return lines

    dirs = []
    files = []
    for entry in entries:
        if entry.startswith(".") or entry == "node_modules" or entry == "__pycache__":
            continue
        full = os.path.join(dirpath, entry)
        if os.path.isdir(full):
            dirs.append(entry)
        else:
            files.append(entry)

    for d in dirs:
        lines.append("  " * indent + d + "/")
        lines.extend(get_dir_tree(os.path.join(dirpath, d), indent + 1, max_depth))

    for f in files:
        lines.append("  " * indent + f)

    return lines


def scan_skills(skills_dir: str) -> list[dict]:
    """Scan a skills directory and extract metadata + file structure."""
    skills = []

    if not os.path.isdir(skills_dir):
        print(f"  ⚠ Skills directory not found: {skills_dir}", file=sys.stderr)
        return skills

    for entry in sorted(os.listdir(skills_dir)):
        skill_path = os.path.join(skills_dir, entry)
        skill_md = os.path.join(skill_path, "SKILL.md")

        if not os.path.isdir(skill_path) or not os.path.isfile(skill_md):
            continue

        meta = parse_frontmatter(skill_md)
        name = meta.get("name", entry)
        description = meta.get("description", "No description")

        # Get file tree
        tree = get_dir_tree(skill_path, max_depth=2)

        # Get size info
        total_size = 0
        file_count = 0
        for root, dirs, files in os.walk(skill_path):
            dirs[:] = [d for d in dirs if not d.startswith(".")]
            for f in files:
                fp = os.path.join(root, f)
                total_size += os.path.getsize(fp)
                file_count += 1

        skills.append({
            "name": name,
            "description": description,
            "path": skill_path,
            "tree": tree,
            "size_kb": round(total_size / 1024, 1),
            "file_count": file_count,
        })

    return skills


def compress_docs_index(docs_dir: str, label: str) -> str:
    """Generate a pipe-delimited compressed docs index for a documentation directory."""
    if not os.path.isdir(docs_dir):
        return f"# ⚠ Docs directory not found: {docs_dir}"

    lines = []
    lines.append(f"[{label}]|root: {docs_dir}")
    lines.append(f"|IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning for any {label} tasks.")

    # Walk directory and group files by parent
    dir_files: dict[str, list[str]] = {}

    for root, dirs, files in os.walk(docs_dir):
        dirs[:] = sorted([d for d in dirs if not d.startswith(".")])
        rel_root = os.path.relpath(root, docs_dir)
        if rel_root == ".":
            rel_root = ""

        doc_files = sorted([f for f in files if not f.startswith(".")])
        if doc_files:
            dir_files[rel_root] = doc_files

    for dir_path, files in sorted(dir_files.items()):
        file_list = ",".join(files)
        if dir_path:
            lines.append(f"|{dir_path}:{{{file_list}}}")
        else:
            lines.append(f"|root:{{{file_list}}}")

    # Calculate compression stats
    full_size = 0
    for root, dirs, files in os.walk(docs_dir):
        for f in files:
            full_size += os.path.getsize(os.path.join(root, f))

    compressed = "\n".join(lines)
    compressed_size = len(compressed.encode("utf-8"))

    return compressed, full_size, compressed_size


def generate_skills_index(skills: list[dict]) -> str:
    """Generate compressed skills index section."""
    if not skills:
        return ""

    lines = []
    lines.append("[Skills Index]")
    lines.append("|IMPORTANT: When a skill is relevant, read its SKILL.md BEFORE writing code or creating files.")
    lines.append("")

    for s in skills:
        # Compact format: name|path|description (truncated)|key_files
        desc_short = s["description"][:120] + "..." if len(s["description"]) > 120 else s["description"]

        # Extract key subdirectories
        subdirs = []
        for line in s["tree"]:
            stripped = line.strip()
            if stripped.endswith("/") and "  " not in line:
                subdirs.append(stripped)

        subdir_str = ",".join(subdirs) if subdirs else ""

        lines.append(f"|{s['name']}|{s['path']}")
        lines.append(f"|  desc: {desc_short}")
        if subdir_str:
            lines.append(f"|  contains: {subdir_str}")
        lines.append(f"|  size: {s['size_kb']}KB ({s['file_count']} files)")

    return "\n".join(lines)


def build_agents_md(
    skills_dirs: list[str],
    docs_sources: list[tuple[str, str]],
    project_instructions: list[str],
    output_format: str = "agents",
) -> str:
    """Build the complete AGENTS.md / CLAUDE.md content."""

    sections = []
    stats = []

    # Header
    filename = "CLAUDE.md" if output_format == "claude" else "AGENTS.md"
    sections.append(f"# {filename}")
    sections.append("")
    sections.append("IMPORTANT: Prefer retrieval-led reasoning over pre-training-led reasoning.")
    sections.append("When working with any framework, library, or tool documented below,")
    sections.append("consult the referenced docs/skills BEFORE relying on training data.")
    sections.append("")

    # Project instructions
    if project_instructions:
        sections.append("## Project Instructions")
        sections.append("")
        for instruction in project_instructions:
            sections.append(f"- {instruction}")
        sections.append("")

    # Skills indexes
    all_skills = []
    for sd in skills_dirs:
        print(f"📂 Scanning skills: {sd}")
        found = scan_skills(sd)
        all_skills.extend(found)
        print(f"   Found {len(found)} skills")

    if all_skills:
        skills_index = generate_skills_index(all_skills)
        sections.append("## Skills")
        sections.append("")
        sections.append(skills_index)
        sections.append("")

        total_skills_size = sum(s["size_kb"] for s in all_skills)
        index_size = len(skills_index.encode("utf-8"))
        stats.append(f"Skills: {len(all_skills)} skills ({total_skills_size:.1f}KB total) → {index_size} byte index")

    # Docs indexes
    for docs_dir, label in docs_sources:
        print(f"📚 Indexing docs: {label} ({docs_dir})")
        result = compress_docs_index(docs_dir, label)

        if isinstance(result, tuple):
            compressed, full_size, compressed_size = result
            ratio = (1 - compressed_size / full_size) * 100 if full_size > 0 else 0
            sections.append(f"## {label}")
            sections.append("")
            sections.append(compressed)
            sections.append("")
            stats.append(
                f"{label}: {full_size/1024:.1f}KB → {compressed_size/1024:.1f}KB index ({ratio:.0f}% compression)"
            )
            print(f"   {full_size/1024:.1f}KB docs → {compressed_size/1024:.1f}KB index ({ratio:.0f}% reduction)")
        else:
            sections.append(result)
            sections.append("")

    # Stats footer (as comment)
    if stats:
        sections.append("<!--")
        sections.append("Generation stats:")
        for s in stats:
            sections.append(f"  {s}")
        total_output = len("\n".join(sections).encode("utf-8"))
        sections.append(f"  Total output: {total_output/1024:.1f}KB")
        sections.append("-->")

    return "\n".join(sections)


def main():
    parser = argparse.ArgumentParser(
        description="Generate AGENTS.md / CLAUDE.md with compressed indexes"
    )
    parser.add_argument(
        "--output", "-o",
        default="AGENTS.md",
        help="Output filename (default: AGENTS.md)"
    )
    parser.add_argument(
        "--skills-dir", "-s",
        action="append",
        default=[],
        help="Path to a skills directory to scan (can specify multiple)"
    )
    parser.add_argument(
        "--docs-dir", "-d",
        nargs=2,
        action="append",
        default=[],
        metavar=("PATH", "LABEL"),
        help="Path to docs directory and its label, e.g. --docs-dir ./.next-docs 'Next.js Docs'"
    )
    parser.add_argument(
        "--instruction", "-i",
        action="append",
        default=[],
        help="Project instruction to include (can specify multiple)"
    )
    parser.add_argument(
        "--format", "-f",
        choices=["agents", "claude"],
        default="agents",
        help="Output format: 'agents' for AGENTS.md, 'claude' for CLAUDE.md"
    )
    parser.add_argument(
        "--append",
        action="store_true",
        help="Append to existing file instead of overwriting"
    )

    args = parser.parse_args()

    docs_sources = [(path, label) for path, label in args.docs_dir]

    content = build_agents_md(
        skills_dirs=args.skills_dir,
        docs_sources=docs_sources,
        project_instructions=args.instruction,
        output_format=args.format,
    )

    mode = "a" if args.append else "w"
    with open(args.output, mode, encoding="utf-8") as f:
        if args.append:
            f.write("\n\n")
        f.write(content)

    size = os.path.getsize(args.output)
    print(f"\n✅ Generated {args.output} ({size/1024:.1f}KB)")


if __name__ == "__main__":
    main()
