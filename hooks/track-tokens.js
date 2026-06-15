#!/usr/bin/env node
// PostToolUse hook — tracks cumulative session tokens and enforces 50k hard cap

const fs = require('fs');
const os = require('os');
const path = require('path');

const TOKEN_CAP = 50000;
const SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours idle = new session
const statePath = path.join(os.homedir(), '.webagent-session-state.json');
const logPath = path.join(os.homedir(), '.webagent-session.log');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);
    const output = String(data.output || '');
    const tool = data.tool_name || 'unknown';

    // Count tokens in this tool call's output
    const chars = output.length;
    const words = output.split(/\s+/).filter(Boolean).length;
    const tokens = Math.ceil((chars / 4 + words * 1.3) / 2);

    // Load or reset session state (reset if > 2 hours idle = new session)
    let state = { total: 0, updatedAt: Date.now() };
    try {
      const saved = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      const age = Date.now() - (saved.updatedAt || 0);
      if (age < SESSION_TIMEOUT_MS) {
        state = saved;
      }
      // else: stale — start fresh
    } catch { /* no state file yet — start fresh */ }

    // Accumulate
    state.total += tokens;
    state.updatedAt = Date.now();
    fs.writeFileSync(statePath, JSON.stringify(state));

    // Debug log — includes running total so you can reconstruct what happened
    const entry = `${new Date().toISOString()} | ${tool} | ${tokens} tokens | session total: ${state.total}\n`;
    fs.appendFileSync(logPath, entry);

    // Hard cap enforcement — kill the session
    if (state.total >= TOKEN_CAP) {
      fs.appendFileSync(logPath,
        `${new Date().toISOString()} | HARD STOP | session total ${state.total} exceeded ${TOKEN_CAP} cap\n`
      );
      console.log(JSON.stringify({
        additionalContext:
          `\n\n[WEBAGENT HARD STOP] Session token total (${state.total}) has exceeded the ` +
          `${TOKEN_CAP}-token cap. STOP all browser actions immediately. Do not call any more ` +
          `Playwright or web tools. Tell the user: "Session token cap (${TOKEN_CAP.toLocaleString()}) ` +
          `reached. Total used: ${state.total.toLocaleString()}. Start a new session to continue."`
      }));
      process.exit(0);
    }

    // Normal — pass through
    console.log(JSON.stringify({ suppressOutput: false }));
  } catch (e) {
    // Never block on hook error — log it silently and exit clean
    try {
      fs.appendFileSync(logPath,
        `${new Date().toISOString()} | HOOK ERROR | track-tokens: ${e.message}\n`
      );
    } catch {}
    process.exit(0);
  }
});
