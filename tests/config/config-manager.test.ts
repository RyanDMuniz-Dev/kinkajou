import {
    mkdtemp,
    readFile,
    rm
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";

import {
    getConfigValue,
    loadConfig,
    saveConfig,
    setConfigValue
} from "../../src/config/config-manager.js";

import type { KinkajouConfig } from "../../src/config/config-types.js";

const CONFIG_DIRECTORY = ".kinkajou";
const CONFIG_FILE = "config.json";

let temporaryDirectory: string;

describe("config-manager", () => {
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

    it("returns the default configuration when no config file exists", async () => {
        const config = await loadConfig();

        assert.deepStrictEqual(
            config,
            {
                manager: "pnpm"
            }
        );
    });

    it("saves and loads a configuration", async () => {
        const config: KinkajouConfig = {
            manager: "npm"
        };

        await saveConfig(config);

        const loadedConfig = await loadConfig();

        assert.deepStrictEqual(
            loadedConfig,
            config
        );
    });

    it("creates the configuration file in the expected location", async () => {
        await saveConfig({
            manager: "pnpm"
        });

        const configPath = join(
            temporaryDirectory,
            CONFIG_DIRECTORY,
            CONFIG_FILE
        );

        const content = await readFile(
            configPath,
            "utf8"
        );

        assert.equal(
            content,
            JSON.stringify(
                {
                    manager: "pnpm"
                },
                null,
                2
            )
        );
    });

    it("updates the package manager configuration", async () => {
        await setConfigValue(
            "manager",
            "yarn"
        );

        const manager =
            await getConfigValue("manager");

        assert.equal(
            manager,
            "yarn"
        );
    });

    it("rejects an unknown package manager", async () => {
        await assert.rejects(
            () => setConfigValue(
                "manager",
                "foobar"
            ),
            {
                message:
                    "Unknown package manager: foobar"
            }
        );
    });

    it("rejects an unknown configuration key", async () => {
        await assert.rejects(
            () => setConfigValue(
                "invalid-key" as keyof KinkajouConfig,
                "value"
            ),
            {
                message:
                    "Unknown configuration key: invalid-key"
            }
        );
    });
});