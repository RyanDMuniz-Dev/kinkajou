import { runProcess } from "../system/process-runner.js";

export type PackageManager = | "pnpm" | "npm" | "yarn" | "bun";

interface PackageManagerDefinition {
    readonly name: PackageManager;
    readonly command: string;
}

const PACKAGE_MANAGERS: Record<PackageManager, PackageManagerDefinition> = {
    pnpm: {
        name: "pnpm",
        command: "pnpm"
    },
    npm: {
        name: "npm",
        command: "npm"
    },
    yarn: {
        name: "yarn",
        command: "yarn"
    },
    bun: {
        name: "bun",
        command: "bun"
    }
}

export function isPackageManager(
    value: string
): value is PackageManager {
    return Object.hasOwn(
        PACKAGE_MANAGERS,
        value
    );
}

export async function installDependencies(
    packageManager: PackageManager,
    projectDirectory: string
): Promise<void> {
    const definition = PACKAGE_MANAGERS[packageManager];

    await runProcess(
        definition.command,
        ["install"],
        {
            cwd: projectDirectory
        }
    );
}