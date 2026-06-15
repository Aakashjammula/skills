#!/usr/bin/env node
// PostToolUse hook — logs every URL visited and captures silent failures

const fs = require('fs');
const os = require('os');
const path = require('path');

const logPath = path.join(os.homedir(), '.webagent-nav.log');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);
    // Claude Code / OpenCode: data.input — Copilot CLI: data.tool_input
    const input = data.input || data.tool_input || {};
    // Claude Code / OpenCode: data.output — Copilot CLI: data.tool_result
    const output = String(data.output || data.tool_result || '');
    const url = input.url || input.href || 'unknown-url';

    // Log the navigation
    fs.appendFileSync(logPath, `${new Date().toISOString()} | ${url}\n`);

    // Detect silent failures — if the output contains error signals Claude might
    // not notice, append a flagged entry so it shows up clearly in the debug log
    const lower = output.toLowerCase();
    const silentFail =
      lower.includes('net::err') ||
      lower.includes('timeout') ||
      lower.includes('page crashed') ||
      lower.includes('cannot navigate') ||
      lower.includes('failed to load') ||
      lower.includes('err_name_not_resolved') ||
      lower.includes('navigation failed');

    if (silentFail) {
      fs.appendFileSync(logPath,
        `${new Date().toISOString()} | SILENT FAILURE at ${url} | ${output.substring(0, 400)}\n`
      );
    }
  } catch (e) {
    // Log hook errors themselves — so hook failures don't disappear silently
    try {
      fs.appendFileSync(logPath,
        `${new Date().toISOString()} | HOOK ERROR | log-navigation: ${e.message}\n`
      );
    } catch {}
  }
  process.exit(0);
});
