import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    mkdir,
    mkdtemp,
    readFile,
    rm
} from "node:fs/promises";

import { tmpdir } from "node:os";
import { join } from "node:path";

import { createProject } from "../../src/project/project-generator.js";

describe("project-generator", () => {
    it("creates a project using the default template", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await createProject("MeuProjeto");

            const projectPath = join(
                temporaryDirectory,
                "MeuProjeto"
            );

            const htmlPath = join(
                projectPath,
                "index.html"
            );

            const htmlContent = await readFile(
                htmlPath,
                "utf8"
            );

            assert.ok(
                htmlContent.length > 0
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("creates a project using the vite-ts template", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await createProject(
                "MeuProjeto",
                "vite-ts"
            );

            const projectPath = join(
                temporaryDirectory,
                "MeuProjeto"
            );

            const packageJsonPath = join(
                projectPath,
                "package.json"
            );

            const packageJson = await readFile(
                packageJsonPath,
                "utf8"
            );

            assert.ok(
                packageJson.length > 0
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("replaces the project name in generated files", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await createProject("ProjetoTeste");

            const htmlPath = join(
                temporaryDirectory,
                "ProjetoTeste",
                "index.html"
            );

            const htmlContent = await readFile(
                htmlPath,
                "utf8"
            );

            assert.ok(
                htmlContent.includes("ProjetoTeste")
            );

            assert.equal(
                htmlContent.includes("{{PROJECT_NAME}}"),
                false
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("creates the project inside the current working directory", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await createProject("MeuProjeto");

            const projectPath = join(
                temporaryDirectory,
                "MeuProjeto"
            );

            const files = await import("node:fs/promises")
                .then((fs) => fs.readdir(projectPath));

            assert.ok(
                files.length > 0
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("rejects when the template does not exist", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await assert.rejects(
                createProject(
                    "MeuProjeto",
                    "template-inexistente"
                ),
                {
                    message: /Template "template-inexistente" not found/
                }
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("does not create the project when the template does not exist", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await assert.rejects(
                createProject(
                    "MeuProjeto",
                    "template-inexistente"
                )
            );

            const projectPath = join(
                temporaryDirectory,
                "MeuProjeto"
            );

            await assert.rejects(
                import("node:fs/promises")
                    .then((fs) => fs.access(projectPath))
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });

    it("rejects when the project directory already exists", async () => {
        const temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );

        const originalDirectory = process.cwd();

        try {
            process.chdir(temporaryDirectory);

            await mkdir("MeuProjeto");

            await assert.rejects(
                createProject("MeuProjeto")
            );
        } finally {
            process.chdir(originalDirectory);

            await rm(
                temporaryDirectory,
                {
                    recursive: true,
                    force: true
                }
            );
        }
    });
});