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

import type { KinkajouConfig } from "./config-types.js";

const CONFIG_DIRECTORY = ".kinkajou";
const CONFIG_FILE = "config.json";

const DEFAULT_CONFIG: KinkajouConfig = {
    manager: "pnpm"
};

function getConfigDirectory (): string {
    const baseDirectory =
        process.env.KINKAJOU_CONFIG_HOME ??
        homedir()

    return join(
        baseDirectory,
        CONFIG_DIRECTORY
    );
}

function getConfigPath(): string {
    return join(
        getConfigDirectory(),
        CONFIG_FILE
    );
}

export async function loadConfig(): Promise<KinkajouConfig> {
    const configPath = getConfigPath();

    try {
        const content = await readFile(
            configPath,
            "utf8"
        );

        return JSON.parse(
            content
        ) as KinkajouConfig;
    } catch {
        return DEFAULT_CONFIG;
    }
}

export async function saveConfig(config: KinkajouConfig): Promise<void> {
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
    key: keyof KinkajouConfig,
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

export async function getConfigValue<K extends keyof KinkajouConfig>(
    key: K
): Promise<KinkajouConfig[K]> {
    const config = await loadConfig();

    return config[key];
}