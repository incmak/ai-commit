import * as vscode from "vscode";
import { generateCommitMessage } from "./commands/generate.js";

export function activate(context: vscode.ExtensionContext): void {
	const disposable = vscode.commands.registerCommand(
		"aiCommit.generate",
		generateCommitMessage,
	);

	context.subscriptions.push(disposable);
}

export function deactivate(): void {
	// Nothing to clean up
}
