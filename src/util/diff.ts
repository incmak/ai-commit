/**
 * Truncate a diff to fit within maxLength characters,
 * cutting at file boundaries to preserve readability.
 */
export function truncateDiff(diff: string, maxLength: number): string {
	if (diff.length <= maxLength) return diff;

	// Split by file boundaries ("diff --git ...")
	const fileDiffs = diff.split(/(?=^diff --git )/m);
	let result = "";
	let fileCount = 0;
	const totalFiles = fileDiffs.length;

	for (const fileDiff of fileDiffs) {
		if (result.length + fileDiff.length > maxLength && result.length > 0) {
			break;
		}
		result += fileDiff;
		fileCount++;
	}

	const omitted = totalFiles - fileCount;
	if (omitted > 0) {
		result += `\n\n... (${omitted} more file(s) truncated for brevity)`;
	}

	return result;
}
