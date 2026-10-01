import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
    getPackageManager,
    isPackageManager
} from "../../src/package-manager/package-manager.js";

describe("package-manager", () => {
    it("recognizes supported package managers", () => {
        assert.equal(
            isPackageManager("pnpm"),
            true
        );

        assert.equal(
            isPackageManager("npm"),
            true
        );

        assert.equal(
            isPackageManager("yarn"),
            true
        );

        assert.equal(
            isPackageManager("bun"),
            true
        );
    });

    it("rejects unsupported package managers", () => {
        assert.equal(
            isPackageManager("foobar"),
            false
        );

        assert.equal(
            isPackageManager("cargo"),
            false
        );

        assert.equal(
            isPackageManager("pip"),
            false
        );
    });

    it("returns all supported package managers", () => {
        const packageManagers =
            getPackageManager();

        assert.deepStrictEqual(
            packageManagers,
            [
                "pnpm",
                "npm",
                "yarn",
                "bun"
            ]
        );
    });

    it("returns a readonly list of supported package managers", () => {
        const packageManagers =
            getPackageManager();

        assert.equal(
            packageManagers.length,
            4
        );

        for (const packageManager of packageManagers) {
            assert.equal(
                isPackageManager(packageManager),
                true
            );
        }
    });
});