import type * as vscode from "vscode";
import type { AiProvider, ProviderPreset } from "./types.js";
import { findBinary, executeCli } from "../cli/executor.js";
import { claudePreset } from "./claude.js";
import { geminiPreset } from "./gemini.js";
import { codexPreset } from "./codex.js";
import { copilotPreset } from "./copilot.js";
import { cursorPreset } from "./cursor.js";
import { createCustomPreset } from "./custom.js";
import type { AiCommitConfig } from "../util/config.js";

const PRESETS: readonly ProviderPreset[] = [
	claudePreset,
	geminiPreset,
	codexPreset,
	copilotPreset,
	cursorPreset,
];

const AUTO_DETECT_ORDER: readonly string[] = [
	"claude",
	"gemini",
	"codex",
	"copilot",
	"cursor",
];

function presetToProvider(
	preset: ProviderPreset,
	timeoutMs: number,
): AiProvider {
	return {
		id: preset.id,
		name: preset.name,

		async checkAvailability(): Promise<boolean> {
			const path = await findBinary(preset.binary);
			return path !== undefined;
		},

		async generate(
			diff: string,
			prompt: string,
			token: vscode.CancellationToken,
		): Promise<string> {
			const fullPrompt = prompt.replace("{diff}", diff);
			const args = preset.buildArgs(fullPrompt);
			const result = await executeCli(
				preset.binary,
				args,
				undefined,
				timeoutMs,
				token,
			);

			if (result.exitCode !== 0) {
				const isAuth =
					/auth|login|sign.in|credential|token|expired/i.test(result.stderr);
				if (isAuth) {
					throw new Error(
						`Authentication required. Run \`${preset.binary}\` in your terminal to authenticate.`,
					);
				}
				throw new Error(
					`${preset.name} exited with code ${result.exitCode}: ${result.stderr.slice(0, 200)}`,
				);
			}

			const output = preset.parseOutput(result.stdout);
			if (!output) {
				throw new Error(`${preset.name} returned an empty response.`);
			}

			return output;
		},
	};
}

export async function resolveProvider(
	config: AiCommitConfig,
): Promise<AiProvider> {
	const timeoutMs = config.timeout * 1000;

	if (config.provider === "custom") {
		if (!config.customCommand.trim()) {
			throw new Error(
				"Custom provider selected but aiCommit.custom.command is empty. Configure it in settings.",
			);
		}
		const preset = createCustomPreset(config.customCommand);
		return presetToProvider(preset, timeoutMs);
	}

	if (config.provider === "auto") {
		for (const id of AUTO_DETECT_ORDER) {
			const preset = PRESETS.find((p) => p.id === id);
			if (!preset) continue;
			const provider = presetToProvider(preset, timeoutMs);
			const available = await provider.checkAvailability();
			if (available) return provider;
		}
		throw new Error(
			"No AI CLI found. Install Claude Code, Gemini CLI, Codex, Copilot, or Cursor — or configure a custom command.",
		);
	}

	const preset = PRESETS.find((p) => p.id === config.provider);
	if (!preset) {
		throw new Error(`Unknown provider: ${config.provider}`);
	}

	const provider = presetToProvider(preset, timeoutMs);
	const available = await provider.checkAvailability();
	if (!available) {
		throw new Error(
			`${preset.name} CLI ("${preset.binary}") not found. Install it or switch to a different provider.`,
		);
	}

	return provider;
}
