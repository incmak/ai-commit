const GUIDANCE: Readonly<Record<number, string>> = {
	1: "Output only the subject line. Max 50 characters. Conventional Commits format (type: description). No body, no bullets, no explanation.",
	2: "Output the subject line (max 50 chars, Conventional Commits format) followed by a blank line and one short body line (max 72 chars) summarizing the change.",
	3: "Output the subject line (max 50 chars, Conventional Commits format), blank line, then 2-3 body bullets describing what changed and why. Wrap at 72 chars.",
	4: "Output a detailed commit message: subject (max 50 chars, Conventional Commits), blank line, then grouped bullet body explaining what changed, why, and any notable implementation details. Wrap at 72 chars.",
	5: "Output a full commit message: subject line (max 50 chars, Conventional Commits), blank line, then a thorough body with sections for motivation, changes, rationale, and impact or risks. Use bullets where helpful. Wrap at 72 chars.",
};

export function verbosityGuidance(level: number): string {
	const clamped = Math.min(5, Math.max(1, Math.round(level)));
	return GUIDANCE[clamped] ?? GUIDANCE[1]!;
}
