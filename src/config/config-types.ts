import type { PackageManager } from "../package-manager/package-manager.js";

export interface WebForgeConfig {
    readonly manager: PackageManager;
}