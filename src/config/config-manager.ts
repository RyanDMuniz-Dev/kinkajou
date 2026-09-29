import {
    mkdir,
    readFile,
    writeFile
} from "node:fs/promises";

import { homedir } from "node:os";
import { join } from "node:path";

import { 
    isPackageManager,
    type PackageManager
 } from "../package-manager/package-manager.js";

import type { WebForgeConfig } from "./config-types.js";

const CONFIG_DIRECTORY = ".webforge";
const CONFIG_FILE = "config.json";

const DEFAULT_CONFIG: WebForgeConfig = {
    manager: "pnpm"
};

function getConfigDirectory(): string {
    return join(
        homedir(),
        CONFIG_DIRECTORY
    );
}

function getConfigPath(): string {
    return join(
        getConfigDirectory(),
        CONFIG_FILE
    );
}

export async function loadConfig(): Promise<WebForgeConfig> {
    const configPath = getConfigPath();

    try {
        const content = await readFile(
            configPath,
            "utf8"
        );

        return JSON.parse(
            content
        ) as WebForgeConfig;
    } catch {
        return DEFAULT_CONFIG;
    }
}

export async function saveConfig(config: WebForgeConfig): Promise<void> {
    const directory = getConfigDirectory();

    await mkdir(directory, {
        recursive: true
    });

    await writeFile(
        getConfigPath(),
        JSON.stringify(config, null, 2),
        "utf8"
    );
}

export async function setConfigValue(
    key: keyof WebForgeConfig,
    value: string
): Promise<void> {
    const config = await loadConfig();

    if (key === "manager") {
        if (!isPackageManager(value)) {
            throw new Error(
                `Unknown package manager: ${value}`
            );
        }

        await saveConfig({
            ...config,
            manager: value
        });

        return;
    }

    throw new Error(
        `Unknown configuration key: ${key}`
    );
}

export async function getConfigValue(key: keyof WebForgeConfig): Promise<string> {
    const config = await loadConfig();

    return config[key]
}