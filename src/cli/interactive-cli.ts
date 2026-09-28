import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import {
  getTemplates,
  type TemplateDefinition
} from "../project/template-manager.js";

interface ProjectAnswers {
  readonly projectName: string;
  readonly templateName: string;
}

export async function promptForProject(): Promise<ProjectAnswers> {
  const rl = createInterface({
    input,
    output
  });

  try {
    const projectName = await rl.question(
      "Project name: "
    );

    const template = await promptForTemplate(
      rl
    );

    return {
      projectName: projectName.trim(),
      templateName: template.name
    };
  } finally {
    rl.close();
  }
}

async function promptForTemplate(
  rl: ReturnType<typeof createInterface>
): Promise<TemplateDefinition> {
  const templates = getTemplates();

  console.log("\nAvailable templates:");

  templates.forEach((template: any, index: any) => {
    console.log(
      `  ${index + 1}. ${template.name} - ${template.description}`
    );
  });

  while (true) {
    const answer = await rl.question(
      "\nChoose a template: "
    );

    const choice = Number.parseInt(
      answer.trim(),
      10
    );

    const template = templates[choice - 1];

    if (template) {
      return template;
    }

    console.log(
      "Invalid template choice. Please try again."
    );
  }
}