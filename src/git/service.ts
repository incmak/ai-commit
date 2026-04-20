import * as vscode from "vscode";
import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

interface GitExtensionApi {
	getAPI(version: 1): GitApi;
}

interface GitApi {
	repositories: GitRepository[];
}

interface GitRepository {
	rootUri: vscode.Uri;
	inputBox: { value: string };
	state: {
		indexChanges: readonly unknown[];
		workingTreeChanges: readonly unknown[];
	};
}

function getGitApi(): GitApi | undefined {
	const gitExtension =
		vscode.extensions.getExtension<GitExtensionApi>("vscode.git");
	if (!gitExtension?.isActive) return undefined;
	return gitExtension.exports.getAPI(1);
}

export async function getRepository(): Promise<GitRepository> {
	const api = getGitApi();
	if (!api) {
		throw new Error("Git extension not available.");
	}

	const repos = api.repositories;
	if (repos.length === 0) {
		throw new Error("No Git repository found in the workspace.");
	}

	if (repos.length === 1) {
		return repos[0]!;
	}

	// Multi-repo: let user pick
	const items = repos.map((repo) => ({
		label: repo.rootUri.fsPath.split("/").pop() ?? repo.rootUri.fsPath,
		description: repo.rootUri.fsPath,
		repo,
	}));

	const picked = await vscode.window.showQuickPick(items, {
		placeHolder: "Select repository to generate commit message for",
	});

	if (!picked) {
		throw new Error("Cancelled");
	}

	return picked.repo;
}

export async function getStagedDiff(repoPath: string): Promise<string> {
	try {
		const { stdout } = await execAsync("git diff --staged", {
			cwd: repoPath,
			maxBuffer: 1024 * 1024 * 10, // 10 MB
		});

		const diff = stdout.trim();
		if (!diff) {
			throw new Error(
				"No staged changes found. Stage your changes first (git add).",
			);
		}

		return diff;
	} catch (err) {
		if (err instanceof Error && err.message.includes("No staged changes")) {
			throw err;
		}
		throw new Error(`Failed to get staged diff: ${(err as Error).message}`);
	}
}

export function setCommitMessage(
	repo: GitRepository,
	message: string,
): void {
	repo.inputBox.value = message;
}
