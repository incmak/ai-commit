# AI Commit

Generate commit messages using any AI coding assistant you already have installed. No API keys needed — uses your existing CLI authentication.

## Features

- **Agent-agnostic** — works with Claude Code, Gemini CLI, OpenAI Codex, GitHub Copilot, Cursor, or any custom CLI
- **Zero configuration** — auto-detects the first available AI CLI on your system
- **SCM integrated** — sparkle button in the Source Control title bar, right where you commit
- **Smart diff handling** — truncates large diffs at file boundaries to stay within token limits
- **Customizable prompts** — configure the prompt template and add extra instructions
- **Clean output** — strips markdown fences, preamble text, and explanations from AI responses

## Usage

1. Stage your changes (`git add`)
2. Click the sparkle icon in the Source Control title bar
3. Review the generated commit message
4. Edit if needed, then commit

## Supported Providers

| Provider | CLI | Auth |
|----------|-----|------|
| Claude Code | `claude` | Existing Claude Code login |
| Gemini CLI | `gemini` | Existing Google auth |
| OpenAI Codex | `codex` | Existing ChatGPT login |
| GitHub Copilot | `gh copilot` | Existing GitHub auth |
| Cursor | `cursor` | Existing Cursor login |
| Custom | Any CLI | You manage |

## Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `aiCommit.provider` | `auto` | Which AI to use (`auto`, `claude`, `gemini`, `codex`, `copilot`, `cursor`, `custom`) |
| `aiCommit.custom.command` | — | Custom CLI command. Use `{prompt}` placeholder |
| `aiCommit.promptTemplate` | Conventional commits | Prompt template. Use `{diff}` placeholder |
| `aiCommit.extraInstructions` | — | Additional instructions appended to the prompt |
| `aiCommit.maxDiffLength` | `20000` | Max diff chars before truncation |
| `aiCommit.timeout` | `60` | CLI timeout in seconds |
| `aiCommit.verbosity` | `2` | Commit message detail level (1–5) |
| `aiCommit.claude.extraArgs` | `[]` | Extra Claude CLI args (e.g., `["--model", "claude-sonnet-4-6"]`). Empty = CLI default |
| `aiCommit.gemini.extraArgs` | `[]` | Extra Gemini CLI args (e.g., `["--model", "gemini-2.5-flash"]`) |
| `aiCommit.codex.extraArgs` | `[]` | Extra Codex CLI args (e.g., `["--model", "gpt-5"]`) |
| `aiCommit.copilot.extraArgs` | `[]` | Extra Copilot CLI args |
| `aiCommit.cursor.extraArgs` | `[]` | Extra Cursor CLI args |

### Verbosity levels

`aiCommit.verbosity` controls commit message detail:

| Level | Output |
|-------|--------|
| 1 | Subject only (≤50 chars) — default |
| 2 | Subject + 1 short body line |
| 3 | Subject + 2-3 bullets (what & why) |
| 4 | Subject + grouped bullet body (detailed) |
| 5 | Full commit: subject + motivation, changes, rationale, impact |

Set in settings:

```json
{ "aiCommit.verbosity": 3 }
```

### Picking a model

By default, each CLI uses its own default model. To override, set `extraArgs` with the model flag for that CLI. Examples:

```json
{
  "aiCommit.claude.extraArgs": ["--model", "claude-haiku-4-5"],
  "aiCommit.gemini.extraArgs": ["--model", "gemini-2.5-flash"]
}
```

Check each CLI's `--help` for supported flags and model names.

## Custom Provider Example

To use any CLI tool that accepts a prompt and outputs text:

```json
{
  "aiCommit.provider": "custom",
  "aiCommit.custom.command": "my-ai generate \"{prompt}\""
}
```

## Requirements

- VS Code 1.85+
- At least one AI coding CLI installed and authenticated
- Git extension (built-in)

## License

MIT
