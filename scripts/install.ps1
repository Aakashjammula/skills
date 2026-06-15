# Install claude-skills into every supported platform's discovery path
# Usage: .\scripts\install.ps1

$RepoDir = Split-Path -Parent $PSScriptRoot
$SkillsDir = Join-Path $RepoDir "skills"

$platforms = @(
    "$env:USERPROFILE\.claude\skills",     # Claude Code
    "$env:USERPROFILE\.opencode\skills",   # OpenCode
    "$env:USERPROFILE\.gemini\skills",     # Antigravity CLI (Google) — same path as old Gemini CLI
    "$env:USERPROFILE\.codex\skills",      # Codex CLI
    "$env:USERPROFILE\.copilot\skills"     # Copilot CLI
)

Write-Host "Installing claude-skills from: $RepoDir"
Write-Host ""

foreach ($skillPath in Get-ChildItem -Path $SkillsDir -Directory) {
    $skillName = $skillPath.Name

    foreach ($platformDir in $platforms) {
        if (-not (Test-Path $platformDir)) {
            New-Item -ItemType Directory -Force $platformDir | Out-Null
        }

        $target = Join-Path $platformDir $skillName

        if (Test-Path $target) {
            $item = Get-Item $target -Force
            if ($item.LinkType -eq "SymbolicLink") {
                Write-Host "  √ $platformDir\$skillName (already linked)"
            } else {
                Write-Host "  ! $platformDir\$skillName exists but is not a symlink — skipping"
            }
        } else {
            New-Item -ItemType SymbolicLink -Path $target -Target $skillPath.FullName | Out-Null
            Write-Host "  √ $platformDir\$skillName → linked"
        }
    }
}

Write-Host ""
Write-Host "Done. Skills available on: Claude Code, OpenCode, Antigravity CLI, Codex CLI, Copilot CLI"
Write-Host ""
Write-Host "Claude Code only — set up hooks manually:"
Write-Host "  1. Run: [Environment]::SetEnvironmentVariable('CLAUDE_SKILLS_DIR', '$RepoDir', 'User')"
Write-Host "  2. Copy hooks/settings-snippet.json into ~/.claude/settings.json"
