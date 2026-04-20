import { describe, it, expect } from "vitest";
import { verbosityGuidance } from "../../src/util/verbosity.js";

describe("verbosityGuidance", () => {
	it("returns subject-only for level 1", () => {
		expect(verbosityGuidance(1)).toMatch(/only the subject/i);
	});

	it("returns distinct guidance for each level 1-5", () => {
		const seen = new Set<string>();
		for (let i = 1; i <= 5; i++) seen.add(verbosityGuidance(i));
		expect(seen.size).toBe(5);
	});

	it("clamps below 1 to level 1", () => {
		expect(verbosityGuidance(0)).toBe(verbosityGuidance(1));
		expect(verbosityGuidance(-10)).toBe(verbosityGuidance(1));
	});

	it("clamps above 5 to level 5", () => {
		expect(verbosityGuidance(6)).toBe(verbosityGuidance(5));
		expect(verbosityGuidance(99)).toBe(verbosityGuidance(5));
	});

	it("rounds fractional levels", () => {
		expect(verbosityGuidance(2.4)).toBe(verbosityGuidance(2));
		expect(verbosityGuidance(3.6)).toBe(verbosityGuidance(4));
	});
});
