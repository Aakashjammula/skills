---
name: webagent
description: Browser automation skill — activates for any web navigation, scraping, content finding, or download task. Enforces clarify → plan → execute with token tracking.
---

# WebAgent — Browser Automation Skill

## When This Skill Activates

Activate whenever the user asks you to:
- Go to a website or URL
- Find, search for, or look up content online
- Scrape, extract, or download data from a site
- Download a video, audio, or file from the internet
- Click, fill, navigate, or interact with a web page
- Research something using a browser

## When NOT to Activate

Do NOT activate for:
- Pure coding questions with no web component
- Tasks where all needed information is already in the conversation
- Reading local files or running local commands with no web step

## Hard Rules — Never Skip These

1. NEVER open a browser before completing Phase 1 (clarification)
2. NEVER take a browser action before showing the Phase 2 plan and getting user approval
3. NEVER skip token reporting after each Phase 3 step
4. NEVER ask preference questions (format, length) before understanding topic and goal

---

## Phase 1: Intent Clarification

Before touching any browser tool, classify the task type and gather context.

### Question Ordering — Strictly Follow This Order

Ask ONE question at a time. Wait for the user's answer before asking the next.

**Order:**
1. **Topic disambiguation** — What exactly does the user mean? Ambiguous words (loops, plans, files, videos) must be clarified before anything else.
2. **User goal** — What is the user trying to achieve? (learn it, use it, compare options, make a decision, archive it?)
3. **Format/preference** — Only ask this if topic and goal are clear but you still need it to execute well.

**Never ask preference questions (short/long, JSON/markdown, quality) before you understand topic and goal. Preferences without context produce irrelevant results.**

Maximum 3 questions total. If topic AND goal are already clear from the user's message, skip Phase 1 entirely.

### Task Type Classification

**`find_content`** — User wants to find something online (videos, articles, examples, demos)
- Q1 (topic): What specifically? ("loops" → which kind? `/loop` command, programming loops, something else?)
- Q2 (goal): What are you trying to do with it — learn how it works, find an example to copy, make a decision?
- Q3 (preference, if needed): Short clip or full walkthrough? Recent or any?

**`scrape_data`** — User wants to extract structured data from a site
- Q1 (topic): What kind of content? (pricing, files, links, text, images, all of the above?)
- Q2 (goal): What will you do with it — archive, process, compare, browse?
- Q3 (preference, if needed): Output as JSON, markdown table, or CSV? Top-level only or recursive?

**`research`** — User wants to gather and compare information
- Q1 (topic): Which product, service, or category specifically?
- Q2 (goal): Why are you researching — purchase decision, competitive analysis, report, personal curiosity?
- Q3 (preference, if needed): Save output? Which format?

**`download`** — User wants to download a video, audio file, or document
- Q1 (goal): Is this for offline viewing, editing the footage, or audio only?
- Q2 (preference): Quality (4K / 1080p / 720p / audio-only)?
- *(No topic Q needed — the URL or content is usually explicit)*
- *(Default output folder is always `~/Downloads/webagent` — only ask if the user specifies a different location)*

**`navigate`** — User gives a specific URL and specific action (click X, fill Y, go to Z)
- No questions. Task is deterministic. Skip directly to Phase 2.

### Example — Correct Question Sequence

User: "find me a YouTube video on loops"

You say:
> Before I open YouTube, I want to make sure I find the right thing.
> When you say "loops" — do you mean the `/loop` command in Claude Code, general programming loops, or something else?

User: "the /loop command, how to use it"

You say:
> Got it. What are you trying to figure out — how to set it up for the first time, understand what interval to pick, or a specific use case you have in mind?

User: "first time setup"

→ Topic and goal are now clear. Move to Phase 2. Do not ask any more questions.

---

## Phase 2: Step Planning

After Phase 1 is complete (or immediately, for deterministic tasks), produce a step plan **before taking any browser action**.

### Plan Format

```
Here's my plan:

  Step 1: [what you'll do]                    [~NNN tokens]
  Step 2: [what you'll do]                    [~NNN tokens]
  Step 3: [what you'll do]                    [~NNN tokens]
  Step 4: [what you'll do]                    [~NNN tokens]

  Estimated total: ~NNN tokens

Proceed? (yes / adjust)
```

Wait for the user to say "yes" or ask for adjustments. Do not take any browser action until you receive approval.

### Token Estimation Per Step

Estimate tokens for each step using this formula:
- Count characters in the expected output for that step
- Count words in the expected output
- Token estimate = average of (characters ÷ 4) and (words × 1.3)
- Round up to nearest 10

Typical ranges:
- Simple navigation (no content extraction): 100–200 tokens
- Search + result list: 150–250 tokens
- Page content extraction (summary, not full HTML): 200–400 tokens
- Structured data output (JSON/table): 100–300 tokens
- Video info / format list: 150–250 tokens

### What to Include in Each Step

Each step in the plan should name:
1. The action (navigate, search, extract, click, download)
2. The target (URL, query, element, topic)
3. What you expect to get back

Example:
```
Step 2: Search YouTube for "/loop command Claude Code tutorial beginner"  [~150 tokens]
        → expect: list of 5–10 video titles, durations, channel names
```

---

## Phase 3: Execution with Token Tracking

Execute each step from the Phase 2 plan one at a time. After every step, report the token count before moving to the next.

### Step Execution Format

After each step completes, output:

```
✓ Step N: [brief description of what was done]
  Tokens this step: NNN  |  Session total: NNN
```

Then proceed to the next step.

### How to Count Tokens After Each Step

After a step completes, count tokens in the content you just processed or returned:
- Characters ÷ 4 = estimate A
- Words × 1.3 = estimate B
- Tokens for this step = round up average of A and B

Add to the running session total. Report both numbers.

### 40,000 Token Warning

Before starting any step that would push the session total above 40,000 tokens, pause and say:

> ⚠️ Session total is approaching 40,000 tokens. Continuing may use significant context.
> Current total: NNN tokens. Next step estimated: ~NNN tokens.
> Continue? (yes / stop)

Wait for user confirmation before proceeding.

### Final Summary

After the last step completes, output a summary:

```
─────────────────────────────────────
Task complete.
Steps executed: N
Total tokens used: NNN
─────────────────────────────────────
[result / recommendations / output here]
```

### Example Execution

```
✓ Step 1: Navigated to youtube.com
  Tokens this step: 142  |  Session total: 142

✓ Step 2: Searched "/loop command Claude Code tutorial beginner"
  Tokens this step: 138  |  Session total: 280

✓ Step 3: Scanned top 5 results, filtered for setup content
  Tokens this step: 290  |  Session total: 570

─────────────────────────────────────
Task complete.
Steps executed: 3
Total tokens used: 570
─────────────────────────────────────

Recommendations:
1. "Claude Code /loop Command — Getting Started" — 6:12
   Jump to 1:30 for the command syntax
2. "Automating Tasks with /loop in Claude Code" — 9:45
   First 4 minutes covers setup
```

---

## Browser Tool Usage Patterns

All browser tools come from the Playwright plugin. Use them in this priority order — prefer high-level tools, fall back to low-level only when needed.

### Tool Selection Guide

**Navigating to a page:**
→ Use `navigate(url)`
→ Never use `evaluate()` to redirect

**Searching the web:**
→ Use `search_web(query)` — returns structured results, not raw HTML
→ Only navigate to individual search results if you need deeper content

**Extracting content from a page:**
→ Use `extract(topic)` — returns relevant text for the topic, not full HTML
→ NEVER return raw `innerHTML` or `outerHTML` to the user — it wastes tokens
→ If `extract` misses something specific, use `page.$$eval()` with a precise selector

**Clicking elements:**
→ Use `click(description)` with natural language ("the Sign Up button", "the first search result")
→ Playwright tries `getByRole()`, `getByText()`, `getByLabel()` in order
→ Only use a raw CSS selector if natural language matching fails

**Filling inputs:**
→ Use `type(selector, text)` with the input's label or placeholder as selector
→ Press Enter after filling search boxes: `press('Enter')`

**When the page is dynamic or hard to parse:**
→ Take a `screenshot()` to understand the current state
→ Then decide which tool to use — never guess blind

**When you need a value from the page that no other tool returns:**
→ Use `evaluate(js)` with minimal, targeted JS
→ Example: `evaluate("document.title")` not `evaluate("document.body.innerHTML")`

### Token Cost by Tool (approximate)

| Tool | Typical token cost | Notes |
|---|---|---|
| `navigate(url)` | 100–200 | Low — just confirmation |
| `search_web(query)` | 150–300 | Returns result summaries |
| `extract(topic)` | 200–500 | Depends on page density |
| `click(description)` | 50–100 | Just confirmation |
| `type(selector, text)` | 50–100 | Just confirmation |
| `screenshot()` | 300–800 | Image tokens — use sparingly |
| `evaluate(js)` | 50–500 | Depends on what JS returns |

---

## yt-dlp Download Commands

Use these via the Bash tool. Always follow the info-first pattern.

### Dependency Check — Always Do This First (Before Any Download)

Before running any download command, verify yt-dlp and ffmpeg are installed:

```bash
yt-dlp --version
```

If that command fails (not found), detect the OS and install automatically:

```bash
# Detect OS
uname 2>/dev/null || echo "windows"
```

Then install based on result:

**Windows (`winget` available):**

Run in PowerShell:
```powershell
winget install yt-dlp.yt-dlp --accept-source-agreements --accept-package-agreements
winget install Gyan.FFmpeg --accept-source-agreements --accept-package-agreements
```

After winget installs, add yt-dlp to the user PATH (winget does NOT do this automatically):
```powershell
# Find where winget placed yt-dlp.exe
$ytdlpExe = Get-ChildItem "$env:LOCALAPPDATA\Microsoft\WinGet\Packages" -Recurse -Filter "yt-dlp.exe" -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
$ytdlpDir = Split-Path $ytdlpExe

# Add to user PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($currentPath -notlike "*$ytdlpDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$ytdlpDir", "User")
}

# Use full path for the current session (PATH won't reload until new terminal)
Set-Alias yt-dlp $ytdlpExe -Scope Global
```

> Note: winget PATH changes only take effect in new terminal sessions. Use the full exe path (stored in `$ytdlpExe`) for all yt-dlp commands in the current session instead of `yt-dlp`.

**Mac (`brew` available):**
```bash
brew install yt-dlp ffmpeg
```

**Linux:**
```bash
pip install yt-dlp
sudo apt install ffmpeg -y
```

After installing, verify both work:
```bash
yt-dlp --version && ffmpeg -version
```

Tell the user: "Installed yt-dlp and ffmpeg — ready to download."

Only proceed to the download once both tools are confirmed working.

### Default Download Folder

Always save downloads to `~/Downloads/webagent/`. Create it before every download:

```bash
# Windows (PowerShell)
New-Item -ItemType Directory -Force "$env:USERPROFILE\Downloads\webagent"

# Mac / Linux
mkdir -p ~/Downloads/webagent
```

Use `-P "~/Downloads/webagent"` in every yt-dlp command. Only override if the user explicitly gives a different path.

After the download completes, always tell the user: `Saved to ~/Downloads/webagent/<filename>`

### Info-First Pattern — Always Do This Before Downloading

Before any download, run:

```bash
yt-dlp --list-formats <url>
```

Show the user the available qualities and estimated sizes using this table format:

```
Available formats for: [video title]
Duration: [HH:MM:SS]

  Quality  │ Type          │ FFmpeg needed │ Est. size (your video)
  ─────────┼───────────────┼───────────────┼───────────────────────
  4K       │ video + audio │ Yes           │ ~X GB
  1080p    │ video + audio │ Yes           │ ~X MB
  720p     │ single stream │ No            │ ~X MB
  mp3      │ audio only    │ Yes (convert) │ ~X MB
  m4a      │ audio only    │ No            │ ~X MB

Which quality would you like?
```

Then wait for the user's selection before running any download command.

### Audio/Video Format Compatibility

**Why `bestaudio` causes no-audio in mp4:**
YouTube's highest-quality audio stream is opus in a webm container. When merged into mp4, many players can't decode it → silent video. Always force `[ext=m4a]` for audio and `[ext=mp4]` for video. The `/best[ext=mp4]/best` fallback chain ensures yt-dlp tries progressively looser options if the exact combo isn't available.

| Video codec | Audio codec | Container | Result |
|---|---|---|---|
| avc1/av01 (mp4) | mp4a (m4a) | mp4 | Works everywhere |
| vp9 (webm) | opus (webm) | webm | Works in Chrome/VLC, not Windows Media Player |
| avc1 (mp4) | opus (webm) | mp4 | **Silent in most players** |

### Download Commands by Quality

**1080p video (most common choice):**
```bash
yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**4K video:**
```bash
yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**1440p video:**
```bash
yt-dlp -f "bestvideo[height<=1440][ext=mp4]+bestaudio[ext=m4a]/best[height<=1440][ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**720p video:**
```bash
yt-dlp -f "bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**480p video:**
```bash
yt-dlp -f "bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**360p video:**
```bash
yt-dlp -f "bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best" --merge-output-format mp4 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**Audio only — MP3:**
```bash
yt-dlp -x --audio-format mp3 --audio-quality 0 -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**Audio only — M4A (better quality, smaller file):**
```bash
yt-dlp -x --audio-format m4a -P "~/Downloads/webagent" -o "%(title)s.%(ext)s" <url>
```

**Custom output folder:**
Replace `~/Downloads/webagent` with any path the user specifies.
Example: `yt-dlp -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4 -P "~/Videos/tutorials" -o "%(title)s.%(ext)s" <url>`

### FFmpeg Dependency Warning

For 4K and 1080p downloads, YouTube serves video and audio as **separate streams** that must be merged. FFmpeg does the merging automatically, but it must be installed.

If the user hasn't installed FFmpeg, say:
> FFmpeg is required to merge the video and audio streams for this quality. Install it first:
> - Windows: `winget install ffmpeg`
> - Mac: `brew install ffmpeg`
> Then re-run the download command.

For 720p and below, a single pre-merged stream is usually available — FFmpeg not required.

### Quality Size Reference

| Quality | Type | FFmpeg | Approx size (10 min video) |
|---|---|---|---|
| 4K (2160p) | video + audio merged | Required | 2–4 GB |
| 1080p | video + audio merged | Required | 300–600 MB |
| 720p | single stream | Not needed | 100–200 MB |
| mp3 | audio only | Required | 15–25 MB |
| m4a | audio only | Not needed | 20–30 MB |

---

## Safety Rules

These rules apply to every task, every time. They cannot be skipped even if the user says "just do it quickly" or "skip the planning".

### Never Skip Phases
- Phase 1 (clarification) can only be skipped if topic AND goal are already unambiguous in the user's message
- Phase 2 (planning) is NEVER skipped — even for a 1-step task, show the plan
- Phase 3 token reporting is NEVER skipped — report after every single step

### Before Any Large Download
Before starting a download over 500MB, confirm with the user:
> This download is estimated at ~X GB. Confirm you have enough disk space and want to proceed?

### Before Recursive Scraping
Before scraping more than 10 pages or going more than 1 level deep:
> This will scrape approximately N pages. That could take several minutes and use ~NNN tokens. Continue?

### If a Tool Fails
If a Playwright tool throws an error or returns unexpected content:
1. Take a `screenshot()` to see the current page state
2. Report what you see to the user
3. Ask whether to retry, adjust, or stop
Never silently retry or guess your way past an error.

### If the Page Requires Login
If a page redirects to a login screen:
> This page requires authentication. I can't proceed without credentials.
> Options: (1) Provide login details, (2) Try a different source, (3) Stop here.

---

## Quick Reference

| Phase | When | What you do |
|---|---|---|
| 1 — Clarify | Before browser opens | Ask topic → goal → preference (max 3 Qs, one at a time) |
| 2 — Plan | Before first action | Show numbered steps with token estimates, wait for approval |
| 3 — Execute | After approval | One step at a time, report tokens after each |

| Download quality | Command flag | FFmpeg needed |
|---|---|---|
| 4K | `bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best` | Yes |
| 1440p | `bestvideo[height<=1440][ext=mp4]+bestaudio[ext=m4a]/best[height<=1440][ext=mp4]/best` | Yes |
| 1080p | `bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best` | Yes |
| 720p | `bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/best[height<=720][ext=mp4]/best` | Yes |
| 480p | `bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/best[height<=480][ext=mp4]/best` | Yes |
| 360p | `bestvideo[height<=360][ext=mp4]+bestaudio[ext=m4a]/best[height<=360][ext=mp4]/best` | Yes |
| MP3 | `-x --audio-format mp3 --audio-quality 0` | Yes |
| M4A | `-x --audio-format m4a` | No |

> Always use `[ext=mp4]+[ext=m4a]` — `bestaudio` alone picks opus/webm which causes silent mp4 on most players.
