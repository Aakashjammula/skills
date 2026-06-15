#!/usr/bin/env bash
# Install claude-skills skills into every supported platform's discovery path
# Usage: bash scripts/install.sh

set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SKILLS_DIR="$REPO_DIR/skills"

platforms=(
  "$HOME/.claude/skills"       # Claude Code
  "$HOME/.opencode/skills"     # OpenCode
  "$HOME/.gemini/skills"       # Antigravity CLI (Google) — also worked with old Gemini CLI
  "$HOME/.codex/skills"        # Codex CLI
  "$HOME/.copilot/skills"      # Copilot CLI
)

echo "Installing claude-skills from: $REPO_DIR"
echo ""

for skill_path in "$SKILLS_DIR"/*/; do
  skill_name="$(basename "$skill_path")"

  for platform_dir in "${platforms[@]}"; do
    mkdir -p "$platform_dir"
    target="$platform_dir/$skill_name"

    if [ -L "$target" ]; then
      echo "  ✓ $platform_dir/$skill_name (already linked)"
    elif [ -e "$target" ]; then
      echo "  ⚠ $platform_dir/$skill_name exists but is not a symlink — skipping"
    else
      ln -s "$skill_path" "$target"
      echo "  ✓ $platform_dir/$skill_name → linked"
    fi
  done
done

echo ""
echo "Done. Skills available on: Claude Code, OpenCode, Antigravity CLI, Codex CLI, Copilot CLI"
echo ""
echo "Claude Code only — set up hooks manually:"
echo "  1. Set CLAUDE_SKILLS_DIR=$REPO_DIR as a system env var"
echo "  2. Copy hooks/settings-snippet.json into ~/.claude/settings.json"
