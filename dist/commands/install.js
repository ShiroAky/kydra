import chalk from "chalk";
import ora from "ora";
import pLimit from "p-limit";
import { Cache } from "../utils/cache.js";
import { DependencyResolver } from "../utils/dependency-resolver.js";
import { PackageManager } from "../utils/package-manager.js";
import { LockfileManager } from "../utils/lockfile-manager.js";
async function loadDependencies(packageManager, limit, cache, resolver, lockfileManager) {
    const dependencies = await packageManager.getAllDependencies();
    return Promise.all(dependencies.map((dep) => limit(() => packageManager.installPackage(dep.name, {
        cache,
        resolver,
        lockfileManager,
        isDev: dep.isDev,
    }))));
}
async function installSinglePackage(packageName, packageManager, cache, resolver, lockfileManager, isDev) {
    await packageManager.installPackage(packageName, {
        cache,
        resolver,
        lockfileManager,
        isDev,
    });
}
export async function install(packageName, options = {}) {
    const spinner = ora("Resolving dependencies...").start();
    const limit = pLimit(8); // Parallel installation limit
    try {
        const cache = new Cache();
        const resolver = new DependencyResolver();
        const packageManager = new PackageManager();
        const lockfileManager = new LockfileManager();
        await lockfileManager.load();
        if (packageName) {
            spinner.text = `Installing ${packageName}...`;
            await installSinglePackage(packageName, packageManager, cache, resolver, lockfileManager, options.saveDev);
        }
        else {
            spinner.text = "Installing dependencies...";
            await loadDependencies(packageManager, limit, cache, resolver, lockfileManager);
        }
        await lockfileManager.save();
        spinner.succeed(chalk.green("Dependencies installed successfully!"));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        spinner.fail(chalk.red(`Installation failed: ${errorMessage}`));
        throw error;
    }
}
