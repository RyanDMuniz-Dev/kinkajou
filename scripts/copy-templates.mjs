import { cp } from "node:fs/promises";
import { join } from "node:path";

const destination = process.argv[2];

if (!destination) {
    throw new Error(
        "Template destination was not provided."
    );
}

await cp(
    "templates",
    join(destination, "templates"),
    {
        recursive: true
    }
);