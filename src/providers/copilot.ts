import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const copilotPreset: ProviderPreset = {
	id: "copilot",
	name: "GitHub Copilot",
	binary: "gh",
	buildArgs(prompt: string): readonly string[] {
		return ["copilot", "-p", prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
