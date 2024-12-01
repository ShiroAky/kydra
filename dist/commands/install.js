import chalk from "chalk";
import ora from "ora";
import pLimit from "p-limit";
import { Cache } from "../utils/cache.js";
import { DependencyResolver } from "../utils/dependency-resolver.js";
import { PackageManager } from "../utils/package-manager.js";
import { LockfileManager } from "../utils/lockfile-manager.js";
export async function install(packageName, options = {}) {
    const spinner = ora("Resolving dependencies...").start();
    const limit = pLimit(8); // Parallel installation limit
    try {
        const cache = new Cache();
        const resolver = new DependencyResolver();
        const packageManager = new PackageManager();
        const lockfileManager = new LockfileManager();
        // Load existing lockfile
        await lockfileManager.load();
        if (packageName) {
            // Install single package
            spinner.text = `Installing ${packageName}...`;
            await packageManager.installPackage(packageName, {
                cache,
                resolver,
                lockfileManager,
                isDev: options.saveDev,
            });
        }
        else {
            // Install all dependencies from package.json
            const dependencies = await packageManager.getAllDependencies();
            spinner.text = "Installing dependencies...";
            await Promise.all(dependencies.map((dep) => limit(() => packageManager.installPackage(dep.name, {
                cache,
                resolver,
                lockfileManager,
                isDev: dep.isDev,
            }))));
        }
        // Save updated lockfile
        await lockfileManager.save();
        spinner.succeed(chalk.green("Dependencies installed successfully!"));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        spinner.fail(chalk.red(`Installation failed: ${errorMessage}`));
        throw error;
    }
}
