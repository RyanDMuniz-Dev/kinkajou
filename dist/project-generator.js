import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
export async function createProject(projectName) {
    const projectPath = join(process.cwd(), projectName);
    await mkdir(projectPath);
    await writeFile(join(projectPath, "index.html"), `
        <!DOCTYPE html>
        <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${projectName}</title>
                <link rel="stylesheet" href="style.css">
            </head>
            <body>
                <h1>${projectName}</h1>
                <script src="script.js"></script>
            </body>
        </html>
        `);
    await writeFile(join(projectPath, "style.css"), `
        * {
            box-sizing: border-box;
        }
        body {
            margin: 0;
            font-family: sans-serif;        
        }
        `);
    await writeFile(join(projectPath, "script.js"), `
        console.log("Hello, from ${projectName}")
        `);
}
//# sourceMappingURL=project-generator.js.map