import * as vscode from "vscode";

export interface AiCommitConfig {
	readonly provider: string;
	readonly customCommand: string;
	readonly promptTemplate: string;
	readonly extraInstructions: string;
	readonly maxDiffLength: number;
	readonly timeout: number;
	readonly verbosity: number;
	readonly extraArgs: Readonly<Record<string, readonly string[]>>;
}

function getExtraArgs(
	config: vscode.WorkspaceConfiguration,
	id: string,
): readonly string[] {
	const raw = config.get<unknown>(`${id}.extraArgs`, []);
	if (!Array.isArray(raw)) return [];
	return raw.filter((v): v is string => typeof v === "string");
}

export function getConfig(): AiCommitConfig {
	const config = vscode.workspace.getConfiguration("aiCommit");

	return {
		provider: config.get<string>("provider", "auto"),
		customCommand: config.get<string>("custom.command", ""),
		promptTemplate: config.get<string>(
			"promptTemplate",
			"Generate a concise git commit message for these staged changes.\nUse conventional commit format (type: description).\nOutput ONLY the commit message, nothing else.\n\n{diff}",
		),
		extraInstructions: config.get<string>("extraInstructions", ""),
		maxDiffLength: config.get<number>("maxDiffLength", 20000),
		timeout: config.get<number>("timeout", 60),
		verbosity: Math.min(5, Math.max(1, config.get<number>("verbosity", 2))),
		extraArgs: {
			claude: getExtraArgs(config, "claude"),
			gemini: getExtraArgs(config, "gemini"),
			codex: getExtraArgs(config, "codex"),
			copilot: getExtraArgs(config, "copilot"),
			cursor: getExtraArgs(config, "cursor"),
		},
	};
}
