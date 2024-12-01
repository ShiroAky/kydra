import chalk from 'chalk';
import ora from 'ora';
import { PackageManager } from '../utils/package-manager.js';
import { Cache } from '../utils/cache.js';
import { DependencyResolver } from '../utils/dependency-resolver.js';
import { LockfileManager } from '../utils/lockfile-manager.js';

export async function update(): Promise<void> {
  const spinner = ora('Checking for updates...').start();

  try {
    const cache = new Cache();
    const resolver = new DependencyResolver();
    const packageManager = new PackageManager();
    const lockfileManager = new LockfileManager();

    const dependencies = await packageManager.getAllDependencies();
    
    spinner.text = 'Updating dependencies...';

    for (const dep of dependencies) {
      await packageManager.installPackage(dep.name, {
        cache,
        resolver,
        lockfileManager,
        isDev: dep.isDev
      });
    }

    await lockfileManager.save();
    
    spinner.succeed(chalk.green('Dependencies updated successfully!'));
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    spinner.fail(chalk.red(`Update failed: ${errorMessage}`));
    throw error;
  }
}