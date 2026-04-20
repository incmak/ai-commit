import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const cursorPreset: ProviderPreset = {
	id: "cursor",
	name: "Cursor",
	binary: "cursor",
	buildArgs(prompt: string): readonly string[] {
		return ["-p", prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
