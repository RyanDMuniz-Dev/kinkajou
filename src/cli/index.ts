#!/usr/bin/env node

import { createProject } from "../project/project-generator.js";
import { promptForProject } from "./interactive-cli.js";
import { installDependencies, isPackageManager, type PackageManager } from "../package-manager/package-manager.js";
import { join } from "node:path";
import { handleConfigCommand } from "./config-cli.js";
import { resolvePackageManager } from "../config/config-resolver.js";
import { showHelp } from "./help.js";
import { showVersion } from "./version.js";
import { validateProjectName } from "../project/project-validator.js";
import { parseArguments } from "./argument-parser.js";

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
        install = answers.install;
        packageManager = answers.packageManager;
    }

    const projectNameError = validateProjectName(projectName);

    if (projectNameError) {
        throw new Error(
            `Invalid project name: ${projectNameError}`
        );
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
        `Unknown command: ${parsedCommand ?? "(none)"}` + 
        '\n\nRun "kajo --help" to see available commands.'
    );
}

main().catch((error: unknown) => {
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
    } else {
        console.error("An unknown error occurred.");
    }

    process.exit(1);
});