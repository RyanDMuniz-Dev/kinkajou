import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

interface TemplateContext {
    readonly projectName: string;
}

export function renderContent(
    content: string,
    context: TemplateContext
): string {
    return content.replaceAll(
        "{{PROJECT_NAME}}",
        context.projectName
    );
}

export async function renderTemplate(
    sourceDirectory: string,
    destinationDirectory: string,
    context: TemplateContext
): Promise<void> {
    const entries = await readdir(sourceDirectory, {
        withFileTypes: true
    });

    for (const entry of entries) {
        const sourcePath = join(sourceDirectory, entry.name);
        const destinationPath = join(destinationDirectory, entry.name);

        if (entry.isDirectory()) {
            await mkdir(destinationPath, {
                recursive: true
            });

            await renderTemplate(
                sourcePath,
                destinationPath,
                context
            );

            continue;

        }

        if (entry.isFile()) {
            const content = await readFile(
                sourcePath,
                "utf-8"
            );

            const renderedContent = renderContent(
                content,
                context
            );

            await writeFile(
                destinationPath,
                renderedContent,
                "utf-8"
            );
        }
    }
}