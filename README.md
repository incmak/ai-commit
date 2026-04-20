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
