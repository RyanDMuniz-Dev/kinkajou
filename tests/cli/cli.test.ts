import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { spawn } from "node:child_process";
import {
    mkdtemp,
    readFile,
    rm
} from "node:fs/promises";

import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

interface CliResult {
    readonly code: number | null;
    readonly stdout: string;
    readonly stderr: string;
}

function runCli(
    args: readonly string[],
    cwd: string,
    environment: NodeJS.ProcessEnv = {}
): Promise<CliResult> {
    const cliPath = fileURLToPath(
        new URL(
            "../../src/cli/index.js",
            import.meta.url
        )
    );

    return new Promise((resolve, reject) => {
        const child = spawn(
            process.execPath,
            [
                cliPath,
                ...args
            ],
            {
                cwd,
                env: {
                    ...process.env,
                    ...environment
                },
                stdio: [
                    "ignore",
                    "pipe",
                    "pipe"
                ]
            }
        );

        let stdout = "";
        let stderr = "";

        child.stdout.on("data", (data: Buffer) => {
            stdout += data.toString();
        });

        child.stderr.on("data", (data: Buffer) => {
            stderr += data.toString();
        });

        child.on("error", reject);

        child.on("close", (code) => {
            resolve({
                code,
                stdout,
                stderr
            });
        });
    });
}

describe("cli", () => {
    it("shows help", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                ["--help"],
                temporaryDirectory
            );

            assert.equal(result.code, 0);
            assert.ok(result.stdout.length > 0);
            assert.equal(result.stderr, "");
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("shows the version", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                ["--version"],
                temporaryDirectory
            );

            assert.equal(result.code, 0);
            assert.match(
                result.stdout,
                /\d+\.\d+\.\d+/
            );
            assert.equal(result.stderr, "");
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("creates a project with the default template", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                ["new", "MeuProjeto"],
                temporaryDirectory
            );

            assert.equal(result.code, 0);

            assert.match(
                result.stdout,
                /Project "MeuProjeto" created successfully!/
            );

            assert.equal(result.stderr, "");

            const htmlPath = join(
                temporaryDirectory,
                "MeuProjeto",
                "index.html"
            );

            const htmlContent = await readFile(
                htmlPath,
                "utf8"
            );

            assert.ok(
                htmlContent.length > 0
            );
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("creates a project with the vite-ts template", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                [
                    "new",
                    "MeuProjeto",
                    "--template",
                    "vite-ts"
                ],
                temporaryDirectory
            );

            assert.equal(result.code, 0);
            assert.equal(result.stderr, "");

            const packageJsonPath = join(
                temporaryDirectory,
                "MeuProjeto",
                "package.json"
            );

            const packageJson = await readFile(
                packageJsonPath,
                "utf8"
            );

            assert.ok(
                packageJson.length > 0
            );
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("reports an error for an unknown command", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                ["comando-inexistente"],
                temporaryDirectory
            );

            assert.equal(result.code, 1);

            assert.match(
                result.stderr,
                /Error: Unknown command/
            );
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("reports an error for an invalid project name", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-cli-test-")
        );

        try {
            const result = await runCli(
                ["new", "."],
                temporaryDirectory
            );

            assert.equal(result.code, 1);

            assert.match(
                result.stderr,
                /Error: Invalid project name/
            );
        } finally {
            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });
});