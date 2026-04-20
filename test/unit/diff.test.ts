import { describe, it, expect } from "vitest";
import { truncateDiff } from "../../src/util/diff.js";

describe("truncateDiff", () => {
	it("returns short diffs unchanged", () => {
		const diff = "diff --git a/file.ts b/file.ts\n+hello";
		expect(truncateDiff(diff, 1000)).toBe(diff);
	});

	it("truncates at file boundaries", () => {
		const file1 = "diff --git a/a.ts b/a.ts\n+line1\n+line2";
		const file2 = "diff --git a/b.ts b/b.ts\n+line3\n+line4";
		const file3 = "diff --git a/c.ts b/c.ts\n+line5\n+line6";
		const diff = `${file1}\n${file2}\n${file3}`;

		// Allow enough for file1 + file2 but not file3
		const maxLen = file1.length + file2.length + 5;
		const result = truncateDiff(diff, maxLen);

		expect(result).toContain("a/a.ts");
		expect(result).toContain("a/b.ts");
		expect(result).not.toContain("a/c.ts");
		expect(result).toContain("1 more file(s) truncated");
	});

	it("includes at least one file even if it exceeds maxLength", () => {
		const diff = "diff --git a/huge.ts b/huge.ts\n" + "+x".repeat(500);
		const result = truncateDiff(diff, 100);
		expect(result).toContain("a/huge.ts");
	});

	it("handles single file diff", () => {
		const diff = "diff --git a/file.ts b/file.ts\n+hello";
		expect(truncateDiff(diff, 10)).toBe(diff);
	});
});
