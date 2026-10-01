import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { validateProjectName } from "../../src/project/project-validator.js";

describe("validateProjectName", () => {
    it("accepts a valid project name", () => {
        assert.equal(
            validateProjectName("MeuSite"),
            undefined
        );
    });

    it("accepts a project name with spaces", () => {
        assert.equal(
            validateProjectName("Meu Site"),
            undefined
        );
    });

    it("rejects an empty project name", () => {
        assert.equal(
            validateProjectName(""),
            "Project name cannot be empty."
        );
    });

    it("rejects a whitespace-only project name", () => {
        assert.equal(
            validateProjectName("   "),
            "Project name cannot be empty."
        );
    });

    it("rejects leading whitespace", () => {
        assert.equal(
            validateProjectName(" MeuSite"),
            "Project name cannot start or end with whitespace."
        );
    });

    it("rejects trailing whitespace", () => {
        assert.equal(
            validateProjectName("MeuSite "),
            "Project name cannot start or end with whitespace."
        );
    });

    it("rejects the current directory name", () => {
        assert.equal(
            validateProjectName("."),
            'Project name "." is not allowed.'
        );
    });

    it("rejects the parent directory name", () => {
        assert.equal(
            validateProjectName(".."),
            'Project name ".." is not allowed.'
        );
    });

    it("rejects path separators", () => {
        assert.equal(
            validateProjectName("foo/bar"),
            "Project name cannot contain path separators."
        );

        assert.equal(
            validateProjectName("foo\\bar"),
            "Project name cannot contain path separators."
        );
    });

    it("rejects invalid Windows characters", () => {
        assert.equal(
            validateProjectName("foo:bar"),
            "Project name contains invalid characters."
        );

        assert.equal(
            validateProjectName("foo*bar"),
            "Project name contains invalid characters."
        );
    });

    it("rejects control characters", () => {
        assert.equal(
            validateProjectName("foo\nbar"),
            "Project name cannot contain control characters."
        );
    });

    it("rejects Windows reserved device names", () => {
        assert.equal(
            validateProjectName("CON"),
            '"CON" is a reserved Windows device name.'
        );

        assert.equal(
            validateProjectName("con"),
            '"con" is a reserved Windows device name.'
        );

        assert.equal(
            validateProjectName("NUL"),
            '"NUL" is a reserved Windows device name.'
        );
    });
});