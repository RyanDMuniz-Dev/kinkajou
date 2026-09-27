#!/usr/bin/env node

import { createProject } from "./project-generator.js";

async function handleNewCommand(projectName: string | undefined) {
    if (!projectName) {
        console.error("Project name is required.");
        process.exit(1);
    }

    createProject(projectName);

    console.log(`Project "${projectName}" created successfully!`);
}

function parseArgument(args: string[]) {
    const command = args[0];
    const projectName = args[1];

    return {
        command,
        projectName
    };
}

const args = process.argv.slice(2);

const { command, projectName} = parseArgument(args);

if (command === "new") {
    handleNewCommand(projectName);
} else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}