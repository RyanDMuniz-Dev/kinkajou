import { createRequire } from "node:module";

interface PackageJson {
    readonly version: string;
}

const require = createRequire(import.meta.url);

const packageJson = require("../../package.json") as PackageJson;

export function showVersion(): void {
    console.log(`kinkajou ${packageJson.version}`)
}