import { spawn } from "node:child_process";

interface RunProcessOptions {
    readonly cwd?: string;
}

export function runProcess(
    command: string,
    args: string[],
    options: RunProcessOptions = {}
): Promise<void> {
    return new Promise((resolve, reject) => {
        const isWindows = process.platform === "win32";

        const executable = isWindows
            ? process.env.ComSpec ?? "cmd.exe"
            : command;

        const processArgs = isWindows
            ? ["/d", "/s", "/c", command, ...args]
            : args;

        const child = spawn(
            executable,
            processArgs,
            {
                cwd: options.cwd,
                stdio: "inherit"
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
                    `Process "${command}" exited with code ${code}.`
                )
            );
        });
    });
}