# Changelog

## 0.3.1

- Default `aiCommit.verbosity` changed from `1` to `2` (subject + short body line)

## 0.3.0

- `aiCommit.verbosity` setting (1-5) controls commit message detail
- Level 1: subject only (default, unchanged behavior). Level 5: full multi-section commit with rationale and impact
- Guidance injected into prompt just before the diff

## 0.2.0

- Per-provider `extraArgs` settings (`aiCommit.claude.extraArgs`, `.gemini.extraArgs`, `.codex.extraArgs`, `.copilot.extraArgs`, `.cursor.extraArgs`)
- Pass model flags or any CLI flag without changing prompt — e.g., `["--model", "gemini-2.5-flash"]`
- Empty default keeps CLI-chosen model

## 0.1.0

- Initial release
- Generate commit messages from staged changes using AI coding CLIs
- Built-in support for Claude Code, Gemini CLI, Codex, Copilot, and Cursor
- Auto-detect first available provider
- Custom command support for any CLI tool
- Configurable prompt template and extra instructions
- Smart diff truncation at file boundaries
- AI output cleaning (strips fences, preamble, explanations)
- Progress indicator in Source Control view
- Multi-repository support with picker
