import { isAbsolute } from "node:path";

const WINDOWS_RESERVED_NAMES = new Set([
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9"
]);

export function validateProjectName(
    projectName: string
): string | undefined {
    const trimmedName = projectName.trim();

    if (!trimmedName) {
        return "Project name cannot be empty.";
    }

    if (trimmedName !== projectName) {
        return "Project name cannot start or end with whitespace.";
    }

    if (trimmedName === "." || trimmedName === "..") {
        return `Project name "${trimmedName}" is not allowed.`;
    }

    if (isAbsolute(trimmedName)) {
        return "Project name must be a directory name, not an absolute path.";
    }

    if (
        trimmedName.includes("/") ||
        trimmedName.includes("\\")
    ) {
        return "Project name cannot contain path separators.";
    }

    if (/[\x00-\x1F]/.test(trimmedName)) {
        return "Project name cannot contain control characters.";
    }

    if (/[<>:"|?*]/.test(trimmedName)) {
        return "Project name contains invalid characters.";
    }

    const nameWithoutExtension = trimmedName.split(".")[0]?.toUpperCase()

    if (nameWithoutExtension) {
        if (WINDOWS_RESERVED_NAMES.has(nameWithoutExtension)) {
            return `"${trimmedName}" is a reserved Windows device name.`;
        }
    }

    if (trimmedName.endsWith(".") || trimmedName.endsWith(" ")) {
        return "Project name cannot end with a dot or whitespace.";
    }

    return undefined;
}