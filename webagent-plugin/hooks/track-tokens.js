#!/usr/bin/env node
// PostToolUse hook — runs after every Playwright tool call
// Counts tokens in the output and appends to session log

const fs = require('fs');
const os = require('os');
const path = require('path');

let raw = '';
process.stdin.on('data', chunk => raw += chunk);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(raw);
    const output = String(data.output || '');
    const tool = data.tool_name || 'unknown';

    const chars = output.length;
    const words = output.split(/\s+/).filter(Boolean).length;
    const tokens = Math.ceil((chars / 4 + words * 1.3) / 2);

    const logPath = path.join(os.homedir(), '.webagent-session.log');
    const entry = `${new Date().toISOString()} | ${tool} | ${tokens} tokens\n`;
    fs.appendFileSync(logPath, entry);

    // Return updated output to Claude with token count appended
    console.log(JSON.stringify({
      output: data.output,
      suppressOutput: false
    }));
  } catch (e) {
    // Never block on hook error
    process.exit(0);
  }
});
