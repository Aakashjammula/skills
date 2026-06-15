#!/usr/bin/env node
// PostToolUse hook — runs after browser_navigate
// Logs every URL visited to session history

const fs = require('fs');
const os = require('os');
const path = require('path');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);
    const input = data.input || {};
    const url = input.url || input.href || 'unknown-url';

    const logPath = path.join(os.homedir(), '.webagent-nav.log');
    const entry = `${new Date().toISOString()} | ${url}\n`;
    fs.appendFileSync(logPath, entry);
  } catch (e) {
    // Never block on hook error
  }
  process.exit(0);
});
