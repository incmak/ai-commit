import * as vscode from "vscode";
import { getConfig } from "../util/config.js";
import { resolveProvider } from "../providers/registry.js";
import { getRepository, getStagedDiff, setCommitMessage } from "../git/service.js";
import { truncateDiff } from "../util/diff.js";

export async function generateCommitMessage(): Promise<void> {
	try {
		const repo = await getRepository();
		const config = getConfig();

		const diff = await getStagedDiff(repo.rootUri.fsPath);
		const truncatedDiff = truncateDiff(diff, config.maxDiffLength);

		const provider = await resolveProvider(config);

		const prompt = config.extraInstructions
			? `${config.promptTemplate}\n\n${config.extraInstructions}`
			: config.promptTemplate;

		const message = await vscode.window.withProgress(
			{
				location: vscode.ProgressLocation.SourceControl,
				title: `AI Commit: Generating with ${provider.name}...`,
				cancellable: true,
			},
			async (_progress, token) => {
				return provider.generate(truncatedDiff, prompt, token);
			},
		);

		setCommitMessage(repo, message);

		// Focus the SCM view so the user sees the populated message
		await vscode.commands.executeCommand("workbench.view.scm");
	} catch (err) {
		const error = err as Error;

		// Silent cancel
		if (error.message === "Cancelled") return;

		// Timeout — offer retry
		if (error.message.includes("timed out")) {
			const action = await vscode.window.showErrorMessage(
				error.message,
				"Retry",
			);
			if (action === "Retry") {
				return generateCommitMessage();
			}
			return;
		}

		// CLI not found or auth — offer settings
		if (
			error.message.includes("not found") ||
			error.message.includes("Configure it") ||
			error.message.includes("No AI CLI found")
		) {
			const action = await vscode.window.showErrorMessage(
				error.message,
				"Open Settings",
			);
			if (action === "Open Settings") {
				await vscode.commands.executeCommand(
					"workbench.action.openSettings",
					"aiCommit",
				);
			}
			return;
		}

		// Empty response — offer retry
		if (error.message.includes("empty response")) {
			const action = await vscode.window.showErrorMessage(
				error.message,
				"Retry",
			);
			if (action === "Retry") {
				return generateCommitMessage();
			}
			return;
		}

		// General error
		vscode.window.showErrorMessage(`AI Commit: ${error.message}`);
	}
}
