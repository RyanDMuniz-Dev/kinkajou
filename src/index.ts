#!/usr/bin/env node

import { error } from "node:console";
import { createProject } from "./project-generator.js";
import { promptForProject } from "./interactive-cli.js";

interface ParsedArguments {
    commmand: string | undefined;
    projectName: string | undefined;
    templateName: string;
}

function parseArguments(args: string[]) : ParsedArguments {
    const commmand = args[0];
    const projectName = args[1];

    let templateName = "none";

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

        throw new Error(
            `Unknown option: ${argument}`
        );
    }

    return {
        commmand,
        projectName,
        templateName
    }
}

async function handleNewCommand(
    projectName: string | undefined,
    templateName: string
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

    console.log(
        `\nProject "${projectName}" created successfully!`
    );
}

async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const {
        commmand,
        projectName,
        templateName
    } = parseArguments(args);

    if (commmand === "new") {
        await handleNewCommand(
            projectName,
            templateName
        );

        return;
    }

    throw new Error(
        `Unknown command: ${commmand ?? "(none)"}`
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