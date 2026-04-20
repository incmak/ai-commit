import type { ProviderPreset } from "./types.js";
import { cleanOutput } from "../util/output.js";

export const cursorPreset: ProviderPreset = {
	id: "cursor",
	name: "Cursor",
	binary: "cursor",
	buildArgs(prompt: string, extraArgs: readonly string[]): readonly string[] {
		return ["-p", ...extraArgs, prompt];
	},
	parseOutput(raw: string): string {
		return cleanOutput(raw);
	},
};
