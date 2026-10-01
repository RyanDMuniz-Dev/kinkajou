import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parseArguments } from "../../src/cli/argument-parser.js";

describe("parseArguments", () => {
    it("parses a basic new command", () => {
        const result = parseArguments([
            "new",
            "MeuSite"
        ]);

        assert.deepStrictEqual(result, {
            command: "new",
            projectName: "MeuSite",
            templateName: "none",
            install: false,
            packageManager: undefined
        });
    });

    it("parses the template option", () => {
        const result = parseArguments([
            "new",
            "MeuSite",
            "--template",
            "vite-ts"
        ]);

        assert.equal(
            result.templateName,
            "vite-ts"
        );
    });

    it("parses the install option", () => {
        const result = parseArguments([
            "new",
            "MeuSite",
            "--install"
        ]);

        assert.equal(
            result.install,
            true
        );
    });

    it("parses the package manager option", () => {
        const result = parseArguments([
            "new",
            "MeuSite",
            "--pm",
            "pnpm"
        ]);

        assert.equal(
            result.packageManager,
            "pnpm"
        );
    });

    it("parses multiple options together", () => {
        const result = parseArguments([
            "new",
            "MeuSite",
            "--template",
            "vite-ts",
            "--install",
            "--pm",
            "pnpm"
        ]);

        assert.deepStrictEqual(result, {
            command: "new",
            projectName: "MeuSite",
            templateName: "vite-ts",
            install: true,
            packageManager: "pnpm"
        });
    });

    it("rejects an option when the project name is missing", () => {
        assert.throws(
            () => parseArguments([
                "new",
                "--install"
            ]),
            {
                message:
                    'The "new" command requires a project name when options are provided.'
            }
        );
    });

    it("rejects an unknown option", () => {
        assert.throws(
            () => parseArguments([
                "new",
                "MeuSite",
                "--unknown"
            ]),
            {
                message:
                    "Unknown option: --unknown"
            }
        );
    });

    it("rejects a missing template value", () => {
        assert.throws(
            () => parseArguments([
                "new",
                "MeuSite",
                "--template"
            ]),
            {
                message:
                    "The --template option requires a template name"
            }
        );
    });

    it("rejects a missing package manager value", () => {
        assert.throws(
            () => parseArguments([
                "new",
                "MeuSite",
                "--pm"
            ]),
            {
                message:
                    "The --pm option requires a package manager"
            }
        );
    });

    it("rejects an unknown package manager", () => {
        assert.throws(
            () => parseArguments([
                "new",
                "MeuSite",
                "--pm",
                "foobar"
            ]),
            {
                message:
                    "Unknown package manager: foobar"
            }
        );
    });
});