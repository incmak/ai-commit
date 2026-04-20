import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export function createCustomPreset(commandTemplate: string): ProviderPreset {
	const parts = commandTemplate.trim().split(/\s+/);
	const binary = parts[0] ?? "";
	const argTemplate = parts.slice(1);

	return {
		id: "custom",
		name: "Custom",
		binary,
		buildArgs(prompt: string, _extraArgs: readonly string[]): readonly string[] {
			return argTemplate.map((arg) => arg.replace("{prompt}", prompt));
		},
		parseOutput(raw: string): string {
			return cleanOutput(raw);
		},
	};
}
