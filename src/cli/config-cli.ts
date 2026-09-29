import { getConfigValue, loadConfig, setConfigValue } from "../config/config-manager.js";

export async function handleConfigCommand(
    args: string[]
): Promise<void> {
    const operation = args[0];
    
    if (operation === "set") {
        await handleSetCommand(args);
        return;
    }

    if (operation === "get") {
        await handleGetCommand(args);
        return;
    }

    if (operation === "list") {
        await handleListCommand();
        return;
    }

    throw new Error(
        "Unknown config command. Available commans: set, get, list."
    )

}

async function handleSetCommand(args:string[]): Promise<void> {
    const key = args[1];
    const value = args[2];

    if (!key) throw new Error(
        "The config set command requires a configuration key."
    );

    if (!value) throw new Error(
        "The config set command requires a value."
    );

    if (key !== "manager") throw new Error(
        `Unknown configuration key: ${key}`
    )

    await setConfigValue(
        key,
        value
    );

    console.log(`Configuration "${key}" set to "${value}"`);
}

async function handleGetCommand(args: string[]): Promise<void> {
    const key = args[1];

    if (!key) throw new Error(
        "The config get command requires a configuration key."
    );

    if (key !== "manager") throw new Error(
        `Unknown configuration key: ${key}`
    );

    const value = await getConfigValue(
        key
    );

    console.log(value);
}

async function handleListCommand(): Promise<void> {
    const config = await loadConfig();

    console.log(
        `  manager: ${config.manager}`
    );

    console.log();
}