import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const claudePreset: ProviderPreset = {
	id: "claude",
	name: "Claude Code",
	binary: "claude",
	buildArgs(prompt: string): readonly string[] {
		return ["-p", "--output-format", "text", prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
