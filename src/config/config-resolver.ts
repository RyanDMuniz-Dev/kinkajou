import type { PackageManager } from "../package-manager/package-manager.js";
import { getConfigValue } from "./config-manager.js";

export async function resolvePackageManager(
    explicitPackageManager?: PackageManager
): Promise <PackageManager> {
    if (explicitPackageManager) {
        return explicitPackageManager;
    }

    return await getConfigValue("manager");
}