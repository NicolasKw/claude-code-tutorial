---
status: partial
phase: 03-tutorial-content-7-levels
source: [03-VERIFICATION.md]
started: 2026-04-03T20:15:00Z
updated: 2026-04-03T20:15:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. ErrorCallout expand/collapse interaction
expected: Open tutorial at level 0 in a browser. Click the "Si ves este error — EACCES: permission denied" summary in the first step's error callout. The `<details>` element toggles open revealing the solution text. Clicking again collapses it.
result: [pending]

### 2. AchievementOverlay summary display after level completion
expected: Complete all steps of Level 0. The overlay shows the real summary text: "Instalaste Claude Code, lo ejecutaste en modo chat, y verificaste que responde. Tenes una herramienta de IA corriendo en tu propia maquina."
result: [pending]

### 3. LevelPage title and subtitle rendering
expected: Navigate to `/tutorial/0` in a running dev server. Page shows "Chatbot" as h1 heading and "Tu primera conversacion con Claude Code" as subtitle below it.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
