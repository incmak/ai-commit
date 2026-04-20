/**
 * Clean AI-generated output by stripping markdown fences, preamble text,
 * and other noise that AI models commonly add around commit messages.
 */
export function cleanOutput(raw: string): string {
	let text = raw.trim();

	// Strip markdown code fences (```...``` or ```text...```)
	const fenceMatch = text.match(/^```[\w]*\n?([\s\S]*?)\n?```$/);
	if (fenceMatch) {
		text = fenceMatch[1]?.trim() ?? text;
	}

	// Strip common AI preamble patterns
	const preamblePatterns = [
		/^(?:here(?:'s| is) (?:a |the |your )?(?:suggested |generated )?commit message[:\s]*\n?)/i,
		/^(?:commit message[:\s]*\n?)/i,
		/^(?:suggested commit message[:\s]*\n?)/i,
	];

	for (const pattern of preamblePatterns) {
		text = text.replace(pattern, "");
	}

	// Strip trailing explanations (lines starting with common patterns after a blank line)
	const parts = text.split(/\n\n/);
	if (parts.length > 1) {
		const lastPart = parts[parts.length - 1] ?? "";
		const explanationPatterns = [
			/^this (?:commit |message )/i,
			/^the (?:commit |changes? |above )/i,
			/^note:/i,
			/^explanation:/i,
			/^i (?:chose|used|went)/i,
		];

		const isExplanation = explanationPatterns.some((p) => p.test(lastPart.trim()));
		if (isExplanation) {
			text = parts.slice(0, -1).join("\n\n");
		}
	}

	// Remove surrounding quotes if the entire message is quoted
	const quoteMatch = text.match(/^["'`]([\s\S]+)["'`]$/);
	if (quoteMatch) {
		text = quoteMatch[1]?.trim() ?? text;
	}

	return text.trim();
}
