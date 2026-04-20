import { describe, it, expect } from "vitest";
import { cleanOutput } from "../../src/util/output.js";

describe("cleanOutput", () => {
	it("returns plain commit messages unchanged", () => {
		expect(cleanOutput("feat: add user login")).toBe("feat: add user login");
	});

	it("trims whitespace", () => {
		expect(cleanOutput("  fix: typo  \n")).toBe("fix: typo");
	});

	it("strips markdown code fences", () => {
		expect(cleanOutput("```\nfeat: add feature\n```")).toBe("feat: add feature");
		expect(cleanOutput("```text\nfeat: add feature\n```")).toBe("feat: add feature");
	});

	it("strips preamble text", () => {
		expect(cleanOutput("Here's a commit message:\nfeat: add login")).toBe(
			"feat: add login",
		);
		expect(cleanOutput("Here is the suggested commit message:\nfix: bug")).toBe(
			"fix: bug",
		);
		expect(cleanOutput("Commit message:\nchore: update deps")).toBe(
			"chore: update deps",
		);
	});

	it("strips trailing explanations", () => {
		const input =
			"feat: add auth\n\nThis commit adds JWT-based authentication.\n\nThis message follows conventional commit format.";
		expect(cleanOutput(input)).toBe(
			"feat: add auth\n\nThis commit adds JWT-based authentication.",
		);
	});

	it("removes surrounding quotes", () => {
		expect(cleanOutput('"feat: add feature"')).toBe("feat: add feature");
		expect(cleanOutput("`fix: typo`")).toBe("fix: typo");
	});

	it("handles multi-line commit messages", () => {
		const input = "feat: add user auth\n\nImplement JWT token validation and refresh flow.";
		expect(cleanOutput(input)).toBe(input);
	});

	it("handles empty input", () => {
		expect(cleanOutput("")).toBe("");
		expect(cleanOutput("   ")).toBe("");
	});
});
