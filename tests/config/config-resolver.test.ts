import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import { resolvePackageManager } from "../../src/config/config-resolver.js";
import { saveConfig } from "../../src/config/config-manager.js";

import {
    mkdtemp,
    rm
} from "node:fs/promises";

import { tmpdir } from "node:os";
import { join } from "node:path";

let temporaryDirectory: string;

describe("config-resolver", () => {
    beforeEach(async () => {
        temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        process.env.KINKAJOU_CONFIG_HOME =
            temporaryDirectory;
    });

    afterEach(async () => {
        delete process.env.KINKAJOU_CONFIG_HOME;

        await rm(temporaryDirectory, {
            recursive: true,
            force: true
        });
    });

    it("returns the explicit package manager", async () => {
        const result =
            await resolvePackageManager("npm");

        assert.equal(
            result,
            "npm"
        );
    });

    it("uses the configured package manager when none is provided", async () => {
        await saveConfig({
            manager: "yarn"
        });

        const result =
            await resolvePackageManager();

        assert.equal(
            result,
            "yarn"
        );
    });

    it("uses the default package manager when no explicit or saved value exists", async () => {
        const result =
            await resolvePackageManager();

        assert.equal(
            result,
            "pnpm"
        );
    });

    it("prioritizes the explicit package manager over the saved configuration", async () => {
        await saveConfig({
            manager: "npm"
        });

        const result =
            await resolvePackageManager("pnpm");

        assert.equal(
            result,
            "pnpm"
        );
    });
});