import * as vscode from "vscode";

export interface AiCommitConfig {
	readonly provider: string;
	readonly customCommand: string;
	readonly promptTemplate: string;
	readonly extraInstructions: string;
	readonly maxDiffLength: number;
	readonly timeout: number;
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
	};
}
