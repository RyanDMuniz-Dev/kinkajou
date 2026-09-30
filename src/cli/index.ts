#!/usr/bin/env node

import { createProject } from "../project/project-generator.js";
import { promptForProject } from "./interactive-cli.js";
import { installDependencies, isPackageManager, type PackageManager } from "../package-manager/package-manager.js";
import { join } from "node:path";
import { handleConfigCommand } from "./config-cli.js";
import { resolvePackageManager } from "../config/config-resolver.js";
import { showHelp } from "./help.js";
import { showVersion } from "./version.js";

interface ParsedArguments {
    command: string | undefined;
    projectName: string | undefined;
    templateName: string | undefined;
    install: boolean;
    packageManager: PackageManager | undefined;
}

function parseArguments(args: string[]) : ParsedArguments {
    const command = args[0];
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

async function handleNewCommand(
    projectName: string | undefined,
    templateName: string | undefined,
    install: boolean,
    packageManager: PackageManager | undefined
): Promise<void> {
    if(!projectName) {
        const answers = await promptForProject();

        projectName = answers.projectName;
        templateName = answers.templateName;
    }

    await createProject(
        projectName,
        templateName
    )

    if (install) {
        const resolvedPackageManager = await resolvePackageManager(packageManager);

        await installDependencies(
            resolvedPackageManager,
            join(process.cwd(), projectName)
        );
    }

    console.log(
        `\nProject "${projectName}" created successfully!`
    );
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    if (command === "--help" || command === "-h" || command === "help") {
        showHelp();
        return;
    }

    if (command === "--version" || command === "-v" || command === "version") {
        showVersion();
        return;
    }

    if (command === "config") {
        await handleConfigCommand(
            args.slice(1)
        );

        return;
    }

    const {
        command: parsedCommand,
        projectName,
        templateName,
        install,
        packageManager
    } = parseArguments(args);

    if (parsedCommand === "new") {
        await handleNewCommand(
            projectName,
            templateName,
            install,
            packageManager
        );

        return;
    }

    throw new Error(
        `Unknown command: ${parsedCommand ?? "(none)"}`
    );
}

main().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
    } else {
        console.error("An unknown error ocurred.");
    }

    process.exit(1);
});