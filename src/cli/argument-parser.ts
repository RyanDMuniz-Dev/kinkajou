import { isPackageManager, type PackageManager } from "../package-manager/package-manager.js";

export interface ParsedArguments {
    readonly command: string | undefined;
    readonly projectName: string | undefined;
    readonly templateName: string | undefined;
    readonly install: boolean;
    readonly packageManager: PackageManager | undefined;
}

export function parseArguments(
    args: readonly string[]
) : ParsedArguments {
    const command = args[0];

    if (command === "new" && args[1]?.startsWith("-")) {
        throw new Error(
            `The "new" command requires a project name when options are provided.`
        );
    }

    const projectName = args[1];

    let templateName = "none";
    let install = false;
    let packageManager: PackageManager | undefined;

    for (let index = 2; index < args.length; index++) {
        const argument = args[index];

        if (argument === "--template") {
            const value = args[index + 1];

            if (!value) {
                throw new Error(
                    "The --template option requires a template name"
                );
            }

            templateName = value;
            index++;

            continue;
        }

        if (argument === "--install") {
            install = true;
            continue;
        }

        if (argument === "--pm") {
            const value = args[index + 1];
            if (!value) {
                throw new Error(
                    "The --pm option requires a package manager"
                );
            }

            if (!isPackageManager(value)) {
                throw new Error(
                    `Unknown package manager: ${value}`
                );
            }

            packageManager = value;
            index++;
            
            continue
        }

        throw new Error(
            `Unknown option: ${argument}`
        );
    }

    return {
        command,
        projectName,
        templateName,
        install,
        packageManager
    }
}