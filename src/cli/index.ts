#!/usr/bin/env node

import { createProject } from "../project/project-generator.js";
import { promptForProject } from "./interactive-cli.js";
import { installDependencies } from "../package-manager/package-manager.js";
import { join } from "node:path";

interface ParsedArguments {
    command: string | undefined;
    projectName: string | undefined;
    templateName: string | undefined;
    install: boolean
}

function parseArguments(args: string[]) : ParsedArguments {
    const command = args[0];
    const projectName = args[1];

    let templateName = "none";
    let install = false;

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

        throw new Error(
            `Unknown option: ${argument}`
        );
    }

    return {
        command,
        projectName,
        templateName,
        install
    }
}

async function handleNewCommand(
    projectName: string | undefined,
    templateName: string | undefined,
    install: boolean
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
        await installDependencies(
            "pnpm",
            join(process.cwd(), projectName)
        )
    }

    console.log(
        `\nProject "${projectName}" created successfully!`
    );
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const {
        command,
        projectName,
        templateName,
        install
    } = parseArguments(args);

    if (command === "new") {
        await handleNewCommand(
            projectName,
            templateName,
            install
        );

        return;
    }

    throw new Error(
        `Unknown command: ${command ?? "(none)"}`
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