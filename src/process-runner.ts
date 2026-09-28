import { spawn } from "node:child_process";
import { error } from "node:console";

interface RunProcessOption {
    readonly cwd?: string;
}

export function runProcess(
    command: string,
    args: string[],
    options: RunProcessOption = {}
) : Promise<void> {
    return new Promise((resolve, reject) => {
        const child = spawn(
            command,
            args,
            {
                cwd: options.cwd,
                stdio: "inherit",
                shell: process.platform === "win32"
            }
        );

        child.on("error", (error) => {
            reject(error);
        });

        child.on("close", (code) => {
            if (code === 0) {
                resolve();
                return;
            }

            reject(
                new Error(
                    `Process "${command}" exited with code ${code}`
                )
            );
        });
    });
}