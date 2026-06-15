# WebAgent — Browser Automation Plugin for Claude Code

A Claude Code plugin that gives any AI agent intelligent web automation. Navigate sites, scrape content, search the internet, and download videos — with automatic step planning, token tracking, and clarifying questions before acting.

## What It Does

Instead of blindly executing web tasks, the agent:

1. **Asks first** — clarifies what you actually mean before opening any browser
2. **Plans out loud** — shows you every step with token cost estimates before executing
3. **Tracks as it goes** — reports tokens used after each step so you always know the cost
4. **Downloads smart** — handles YouTube video/audio downloads with automatic quality selection

## Install

```bash
# 1. Clone the repo
git clone <this-repo-url>

# 2. Install the plugin
claude plugin install ./webagent-plugin
```

That's it. The plugin uses tools Claude Code already has (Playwright for browser control, Bash for downloads).

> **For video/audio downloads:** yt-dlp and ffmpeg are required — but Claude installs them automatically the first time you ask for a download. No manual setup needed.

## Requirements

- [Claude Code](https://claude.ai/code) (any version)
- [Playwright plugin](https://claude.ai/code/plugins) — for browser control (install via `claude plugin install playwright`)

## Example Prompts

**Find content:**
```
go to youtube and find me a video on Claude Code hooks
```
Claude will ask what you mean by "hooks" and what you're trying to learn — then search with the right context.

**Scrape a site:**
```
go to https://example.com and get all their pricing plans
```
Claude will ask what format you want the data in, then scrape and return structured results.

**Download a video:**
```
download this youtube video: https://youtube.com/watch?v=...
```
Claude will show available qualities and sizes, wait for your choice, then download. yt-dlp and ffmpeg are auto-installed if missing.

**Navigate and extract:**
```
go to linear.app and tell me what their enterprise plan includes
```
No questions needed — deterministic task, Claude goes straight to planning.

## How It Works

Every task follows three phases:

```
Phase 1 — Clarify (before browser opens)
  Claude asks: what exactly do you mean? what's your goal?
  Max 3 questions, one at a time.

Phase 2 — Plan (before first action)
  Claude shows:
    Step 1: Navigate to site          [~180 tokens]
    Step 2: Search for content        [~150 tokens]
    Step 3: Extract relevant data     [~300 tokens]
    Estimated total: ~630 tokens
  Proceed? (yes / adjust)

Phase 3 — Execute (with live token tracking)
  ✓ Step 1 complete | tokens: 142 | total: 142
  ✓ Step 2 complete | tokens: 138 | total: 280
  ✓ Step 3 complete | tokens: 290 | total: 570

  ─────────────────────
  Task complete.
  Total tokens used: 570
  ─────────────────────
```

## Download Quality Options

| Quality | Type | Size (10 min video) |
|---|---|---|
| 4K | video + audio merged | 2–4 GB |
| 1080p | video + audio merged | 300–600 MB |
| 720p | single stream | 100–200 MB |
| MP3 | audio only | 15–25 MB |
| M4A | audio only (better quality) | 20–30 MB |

Claude always shows available formats and sizes before downloading — no surprises.

## Optional: Playwright Hooks (Recommended)

Two hooks give you automatic token tracking and navigation logging on every browser action.

**What they do:**
- `track-tokens.js` — counts tokens from every Playwright tool output, writes to `~/.webagent-session.log`
- `log-navigation.js` — logs every URL visited to `~/.webagent-nav.log`

**Setup:** Add this to your `~/.claude/settings.json` (replace `/path/to/webagent-plugin` with your actual clone path):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "mcp__plugin_playwright_playwright__.*",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/webagent-plugin/hooks/track-tokens.js"
          }
        ]
      },
      {
        "matcher": "mcp__plugin_playwright_playwright__browser_navigate",
        "hooks": [
          {
            "type": "command",
            "command": "node /path/to/webagent-plugin/hooks/log-navigation.js"
          }
        ]
      }
    ]
  }
}
```

The token log gives Claude real measured token counts instead of estimates, making the Phase 3 reporting more accurate.

## Works With

- Claude Code
- OpenCode
- Any agent that supports Claude Code plugins

## No MCP Libraries

This plugin uses no third-party MCP libraries — [which have known security vulnerabilities](https://www.ox.security/blog/mcp-supply-chain-advisory-rce-vulnerabilities-across-the-ai-ecosystem/). It's a pure skill plugin: two files, fully auditable, nothing running in the background.
