import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const codexPreset: ProviderPreset = {
	id: "codex",
	name: "OpenAI Codex",
	binary: "codex",
	buildArgs(prompt: string): readonly string[] {
		return ["exec", prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
