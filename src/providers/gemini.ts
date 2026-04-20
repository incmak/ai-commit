import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const geminiPreset: ProviderPreset = {
	id: "gemini",
	name: "Gemini CLI",
	binary: "gemini",
	buildArgs(prompt: string): readonly string[] {
		return [prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
