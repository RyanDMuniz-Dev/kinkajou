import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import {
  getTemplates,
  type TemplateDefinition,
  type TemplateName
} from "../project/template-manager.js";
import { 
  getPackageManager,
  type PackageManager,
} from "../package-manager/package-manager.js";
import { getConfigValue } from "../config/config-manager.js";
import { validateProjectName } from "../project/project-validator.js";

interface ProjectAnswers {
  readonly projectName: string;
  readonly templateName: TemplateName;
  readonly install: boolean;
  readonly packageManager: PackageManager | undefined;
}

export async function promptForProject(): Promise<ProjectAnswers> {
  const r1 = createInterface({
    input,
    output
  });

  try {
    const projectName = await promptForProjectName(r1);
    const template = await promptForTemplate(r1);
    const install = await promptForInstall(r1);

    let packageManager: PackageManager | undefined;

    if (install) {
      packageManager = await promptForPackageManager(r1);
    }

    return {
      projectName,
      templateName: template.name,
      install,
      packageManager
    };
  } finally {
    r1.close();
  }

}

async function promptForTemplate(
  rl: ReturnType<typeof createInterface>
): Promise<TemplateDefinition> {
  const templates = getTemplates();

  console.log("\nAvailable templates:");

  templates.forEach((template, index) => {
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

async function promptForProjectName(rl: ReturnType<typeof createInterface>): Promise<string> {
  while (true) {
    const answer = await rl.question(
      "Project name: "
    );

    const projectName = answer.trim();

    const error = validateProjectName(projectName);

    if (!error) {
      return projectName;
    }

    console.log(`Invalidate project name: ${error}`)
  }
}

async function promptForInstall(
  rl: ReturnType<typeof createInterface>
): Promise<boolean> {
  while (true) {
    const answer = await rl.question(
      "\nInstall dependencies? [y/N]: "
    );

    const normalizedAnswer = answer.trim().toLowerCase();

    if (
      normalizedAnswer === "n" ||
      normalizedAnswer === "no"
    ) {
      return false;
    }

    if (
      normalizedAnswer === "y" ||
      normalizedAnswer === "yes"
    ) {
      return true;
    }

    console.log(
      "Please answer with y or n."
    );
  }
}

async function promptForPackageManager(
  rl: ReturnType<typeof createInterface>
): Promise<PackageManager> {
  const packageManagers = await getPackageManager();
  const configuredManager =await getConfigValue("manager");

  console.log(
    `\nConfigured package manager: ${configuredManager}`
  );

  console.log("\nAvailable package managers:");

  packageManagers.forEach((manager, index) => {
    const suffix =
        manager === configuredManager
            ? " (configured)"
            : "";

    console.log(
        `  ${index + 1}. ${manager}${suffix}`
    );
  });

  while (true) {
    const answer = await rl.question(
      `\nChoose a package manager [${packageManagers.indexOf(configuredManager) + 1}]: `
    );

    const trimmedAnswer = answer.trim();

    if (!trimmedAnswer) {
      return configuredManager;
    }

    const choice = Number.parseInt(
      trimmedAnswer,
      10
    );

    const packageManager = packageManagers[choice - 1];

    if (packageManager) {
      return packageManager;
    }

    console.log(
      "Invalid package manager choice. Please try again."
    );
  }

}