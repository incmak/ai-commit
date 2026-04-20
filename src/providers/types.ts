import type * as vscode from "vscode";

export interface AiProvider {
	readonly id: string;
	readonly name: string;
	checkAvailability(): Promise<boolean>;
	generate(
		diff: string,
		prompt: string,
		token: vscode.CancellationToken,
	): Promise<string>;
}

export interface ProviderPreset {
	readonly id: string;
	readonly name: string;
	readonly binary: string;
	buildArgs(prompt: string): readonly string[];
	parseOutput(raw: string): string;
}

export interface CliResult {
	readonly stdout: string;
	readonly stderr: string;
	readonly exitCode: number;
}
