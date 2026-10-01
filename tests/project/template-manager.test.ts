import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    getTemplate,
    getTemplates,
    isTemplateName
} from "../../src/project/template-manager.js";

describe("template-manager", () => {
    it("recognizes a valid template name", () => {
        assert.equal(
            isTemplateName("none"),
            true
        );

        assert.equal(
            isTemplateName("vite-ts"),
            true
        );
    });

    it("rejects an unknown template name", () => {
        assert.equal(
            isTemplateName("react"),
            false
        );

        assert.equal(
            isTemplateName("unknown"),
            false
        );
    });

    it("returns the none template", () => {
        const template = getTemplate("none");

        assert.equal(
            template.name,
            "none"
        );

        assert.equal(
            template.description,
            "Pure HTML, CSS and JavaScript"
        );

        assert.ok(
            template.directory.length > 0
        );
    });

    it("returns the vite-ts template", () => {
        const template = getTemplate("vite-ts");

        assert.equal(
            template.name,
            "vite-ts"
        );

        assert.equal(
            template.description,
            "Vite + TypeScript"
        );

        assert.ok(
            template.directory.length > 0
        );
    });

    it("throws when requesting an unknown template", () => {
        assert.throws(
            () => getTemplate("react"),
            {
                message:
                    'Template "react" not found.\n\nAvailable templates:\n  none\n  vite-ts'
            }
        );
    });

    it("returns all registered templates", () => {
        const templates = getTemplates();

        assert.equal(
            templates.length,
            2
        );

        assert.deepStrictEqual(
            templates.map(
                (template) => template.name
            ),
            [
                "none",
                "vite-ts"
            ]
        );
    });
});