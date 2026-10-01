import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { runProcess } from "../../src/system/process-runner.js";

describe("process-runner", () => {
    it("resolves when the process exits successfully", async () => {
        await assert.doesNotReject(
            runProcess(
                "node",
                [
                    "-e",
                    "process.exit(0)"
                ]
            )
        );
    });

    it("rejects when the process exits with a non-zero code", async () => {
        await assert.rejects(
            runProcess(
                "node",
                [
                    "-e",
                    "process.exit(1)"
                ]
            ),
            {
                message:
                    'Process "node" exited with code 1.'
            }
        );
    });

    it("reports the exit code when the process fails", async () => {
        await assert.rejects(
            runProcess(
                "node",
                [
                    "-e",
                    "process.exit(42)"
                ]
            ),
            {
                message:
                    'Process "node" exited with code 42.'
            }
        );
    });

    it("rejects when the process cannot be started", async () => {
        await assert.rejects(
            runProcess(
                "kinkajou-command-that-does-not-exist",
                []
            )
        );
    });
});