import {
    mkdtemp,
    mkdir,
    readFile,
    rm,
    writeFile
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    afterEach,
    beforeEach,
    describe,
    it
} from "node:test";
import assert from "node:assert/strict";

import {
    renderContent,
    renderTemplate
} from "../../src/project/template-renderer.js";

interface TestContext {
    readonly projectName: string;
}

let temporaryDirectory: string;

describe("template-renderer", () => {
    beforeEach(async () => {
        temporaryDirectory = await mkdtemp(
            join(tmpdir(), "kinkajou-test-")
        );
    });

    afterEach(async () => {
        await rm(temporaryDirectory, {
            recursive: true,
            force: true
        });
    });

    it("replaces the project name placeholder", () => {
        const context: TestContext = {
            projectName: "MeuSite"
        };

        const result = renderContent(
            "Hello {{PROJECT_NAME}}!",
            context
        );

        assert.equal(
            result,
            "Hello MeuSite!"
        );
    });

    it("replaces multiple project name placeholders", () => {
        const context: TestContext = {
            projectName: "MeuSite"
        };

        const result = renderContent(
            "{{PROJECT_NAME}} - {{PROJECT_NAME}}",
            context
        );

        assert.equal(
            result,
            "MeuSite - MeuSite"
        );
    });

    it("keeps content without placeholders unchanged", () => {
        const context: TestContext = {
            projectName: "MeuSite"
        };

        const content =
            "This content has no placeholders.";

        const result = renderContent(
            content,
            context
        );

        assert.equal(
            result,
            content
        );
    });

    it("renders files into the destination directory", async () => {
        const sourceDirectory = join(
            temporaryDirectory,
            "source"
        );

        const destinationDirectory = join(
            temporaryDirectory,
            "destination"
        );

        await mkdir(sourceDirectory);

        await writeFile(
            join(sourceDirectory, "index.html"),
            "<title>{{PROJECT_NAME}}</title>",
            "utf8"
        );

        await mkdir(destinationDirectory);

        await renderTemplate(
            sourceDirectory,
            destinationDirectory,
            {
                projectName: "MeuSite"
            }
        );

        const content = await readFile(
            join(destinationDirectory, "index.html"),
            "utf8"
        );

        assert.equal(
            content,
            "<title>MeuSite</title>"
        );
    });

    it("renders nested directories recursively", async () => {
        const sourceDirectory = join(
            temporaryDirectory,
            "source"
        );

        const destinationDirectory = join(
            temporaryDirectory,
            "destination"
        );

        const sourceDirectoryNested = join(
            sourceDirectory,
            "src",
            "components"
        );

        await mkdir(
            sourceDirectoryNested,
            {
                recursive: true
            }
        );

        await mkdir(
            destinationDirectory
        );

        await writeFile(
            join(
                sourceDirectoryNested,
                "Button.ts"
            ),
            "export const name = '{{PROJECT_NAME}}';",
            "utf8"
        );

        await renderTemplate(
            sourceDirectory,
            destinationDirectory,
            {
                projectName: "MeuSite"
            }
        );

        const content = await readFile(
            join(
                destinationDirectory,
                "src",
                "components",
                "Button.ts"
            ),
            "utf8"
        );

        assert.equal(
            content,
            "export const name = 'MeuSite';"
        );
    });
});