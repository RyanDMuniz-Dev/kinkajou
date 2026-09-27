import { join } from "node:path";
import { mkdir } from "node:fs/promises";

import { getTemplate } from "./template-manager.js";
import { renderTemplate } from "./template-renderer.js";

export async function createProject(
    projectName:string, 
    templateName: string = "none"
): Promise<void> {
    const projectPath = join(
        process.cwd(),
        projectName
    );

    const template = getTemplate(templateName);

    await mkdir(projectPath);

    renderTemplate(
        template.directory,
        projectPath,
        {
            projectName
        }
    )

}