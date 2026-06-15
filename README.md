# claude-skills

A growing collection of Claude Code skills and plugins.

No server. No MCP libraries. No supply chain risk.

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

| Platform | Skills | Hooks | Plugin manifest |
|---|---|---|---|
| Claude Code | ✓ | ✓ (track-tokens, log-navigation) | ✓ (plugin.json) |
| OpenCode | ✓ | — | — |
| Antigravity CLI (Google) | ✓ | — | — |
| Codex CLI (OpenAI) | ✓ | — | — |
| Copilot CLI | ✓ | — | — |

---

## Adding a skill

Create `skills/<name>/SKILL.md` — no other config needed. Add a row to the table above and a `skills/<name>/README.md` for docs.
