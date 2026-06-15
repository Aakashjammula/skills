# claude-skills

Cross-platform AI agent skills collection. Currently includes:

- **webagent** — browser automation with 3-phase planning, token tracking, and yt-dlp downloads

## Skills

Skills live in `skills/<name>/SKILL.md`. They follow the SKILL.md open standard and work on Claude Code, Codex CLI, Antigravity CLI (Google), OpenCode, and Copilot CLI without modification.

## Hooks (Claude Code only)

`hooks/` contains PostToolUse hooks for measured token counting and navigation logging. These are Claude Code specific — other platforms use their own hook systems or none.

## Output

All downloads and scraped files save to `~/Downloads/webagent/`.
