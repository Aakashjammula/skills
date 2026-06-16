# claude-skills

A Claude Code plugin — a growing collection of skills.

---

## Skills

| Skill | What it does | Docs |
|---|---|---|
| `webagent` | Browser automation — navigate, scrape, research, download with 3-phase planning and token tracking | [README](skills/webagent/README.md) |

---

## Install

Clone and run the install script. It symlinks every skill into each platform's discovery path automatically.

```bash
# Mac / Linux
git clone <repo-url>
cd claude-skills
bash scripts/install.sh
```

```powershell
# Windows (run as Administrator for symlinks)
git clone <repo-url>
cd claude-skills
.\scripts\install.ps1
```

---

## Platform Compatibility

Skills follow the [SKILL.md open standard](https://www.agensi.io/learn/agent-skills-open-standard) and work across all major AI coding agents without modification.

| Platform | Skills | Hooks | Config snippet |
|---|---|---|---|
| Claude Code | ✓ | ✓ | `hooks/settings-snippet.json` |
| OpenCode | ✓ | ✓ | `hooks/settings-snippet.json` (compatible) |
| Codex CLI (OpenAI) | ✓ | ✓ | `hooks/codex-snippet.json` |
| Copilot CLI | ✓ | ✓ | `hooks/copilot-snippet.json` |
| Antigravity CLI (Google) | ✓ | — | Python SDK hooks — not yet supported |

---

## Adding a skill

Create `skills/<name>/SKILL.md` — no other config needed. Add a row to the table above and a `skills/<name>/README.md` for docs.
