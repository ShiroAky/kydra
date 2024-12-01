import { Cache } from "./cache.js";
import { DependencyResolver } from "./dependency-resolver.js";
import { LockfileManager } from "./lockfile-manager.js";
import { PackageJson } from "../types/package.js";
interface InstallOptions {
    cache: Cache;
    resolver: DependencyResolver;
    lockfileManager: LockfileManager;
    isDev?: boolean;
}
export declare class PackageManager {
    private packageJsonPath;
    constructor();
    installPackage(name: string, options: InstallOptions): Promise<void>;
    getAllDependencies(): Promise<Array<{
        name: string;
        isDev: boolean;
    }>>;
    readPackageJson(): Promise<PackageJson>;
    writePackageJson(pkg: PackageJson): Promise<void>;
    private downloadPackage;
    private extractPackage;
}
export {};
