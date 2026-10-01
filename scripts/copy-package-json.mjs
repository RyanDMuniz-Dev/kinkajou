import { copyFile } from "node:fs/promises";
import { join } from "node:path";

const destination = process.argv[2];

if (!destination) {
    throw new Error(
        "Package.json destination was not provided."
    );
}

await copyFile(
    "package.json",
    join(destination, "package.json")
);