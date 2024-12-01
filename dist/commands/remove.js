import chalk from 'chalk';
import ora from 'ora';
import { PackageManager } from '../utils/package-manager.js';
import { LockfileManager } from '../utils/lockfile-manager.js';
export async function remove(packageName) {
    const spinner = ora(`Removing package ${packageName}...`).start();
    try {
        const packageManager = new PackageManager();
        const lockfileManager = new LockfileManager();
        await lockfileManager.load();
        const pkg = await packageManager.readPackageJson();
        // Remove from dependencies and devDependencies
        if (pkg.dependencies?.[packageName]) {
            delete pkg.dependencies[packageName];
        }
        if (pkg.devDependencies?.[packageName]) {
            delete pkg.devDependencies[packageName];
        }
        // Remove from lockfile
        lockfileManager.removeDependency(packageName);
        // Save changes
        await packageManager.writePackageJson(pkg);
        await lockfileManager.save();
        spinner.succeed(chalk.green(`Package ${packageName} removed successfully!`));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        spinner.fail(chalk.red(`Failed to remove package: ${errorMessage}`));
        throw error;
    }
}
