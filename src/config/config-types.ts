import type { PackageManager } from "../package-manager/package-manager.js";

export interface KinkajouConfig {
    readonly manager: PackageManager;
}