import { spawn } from "node:child_process";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import type * as vscode from "vscode";
import type { CliResult } from "../providers/types.js";

const execAsync = promisify(exec);

export async function findBinary(name: string): Promise<string | undefined> {
	const cmd = process.platform === "win32" ? "where" : "which";
	try {
		const { stdout } = await execAsync(`${cmd} ${name}`);
		const path = stdout.trim().split("\n")[0];
		return path || undefined;
	} catch {
		return undefined;
	}
}

export function executeCli(
	binary: string,
	args: readonly string[],
	stdin: string | undefined,
	timeoutMs: number,
	token: vscode.CancellationToken,
): Promise<CliResult> {
	return new Promise((resolve, reject) => {
		const child = spawn(binary, [...args], {
			stdio: ["pipe", "pipe", "pipe"],
			env: { ...process.env },
			shell: process.platform === "win32",
		});

		let stdout = "";
		let stderr = "";

		child.stdout.on("data", (data: Buffer) => {
			stdout += data.toString();
		});

		child.stderr.on("data", (data: Buffer) => {
			stderr += data.toString();
		});

		const timer = setTimeout(() => {
			child.kill("SIGTERM");
			reject(new Error(`CLI timed out after ${timeoutMs / 1000}s`));
		}, timeoutMs);

		const cancelListener = token.onCancellationRequested(() => {
			child.kill("SIGTERM");
			reject(new Error("Cancelled"));
		});

		child.on("close", (exitCode) => {
			clearTimeout(timer);
			cancelListener.dispose();
			resolve({ stdout, stderr, exitCode: exitCode ?? 1 });
		});

		child.on("error", (err) => {
			clearTimeout(timer);
			cancelListener.dispose();
			reject(err);
		});

		if (stdin !== undefined) {
			child.stdin.write(stdin);
			child.stdin.end();
		}
	});
}
