import chalk from "chalk";
import ora from "ora";
import pLimit from "p-limit";
import { Cache } from "../utils/cache.js";
import { DependencyResolver } from "../utils/dependency-resolver.js";
import { PackageManager } from "../utils/package-manager.js";
import { LockfileManager } from "../utils/lockfile-manager.js";

interface InstallOptions {
  saveDev?: boolean;
}

async function loadDependencies(
  packageManager: PackageManager,
  limit: ReturnType<typeof pLimit>,
  cache: Cache,
  resolver: DependencyResolver,
  lockfileManager: LockfileManager
) {
  const dependencies = await packageManager.getAllDependencies();
  return Promise.all(
    dependencies.map((dep) =>
      limit(() =>
        packageManager.installPackage(dep.name, {
          cache,
          resolver,
          lockfileManager,
          isDev: dep.isDev,
        })
      )
    )
  );
}

async function installSinglePackage(
  packageName: string,
  packageManager: PackageManager,
  cache: Cache,
  resolver: DependencyResolver,
  lockfileManager: LockfileManager,
  isDev?: boolean
) {
  await packageManager.installPackage(packageName, {
    cache,
    resolver,
    lockfileManager,
    isDev,
  });
}

export async function install(
  packageName?: string,
  options: InstallOptions = {}
): Promise<void> {
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
      await installSinglePackage(
        packageName,
        packageManager,
        cache,
        resolver,
        lockfileManager,
        options.saveDev
      );
    } else {
      spinner.text = "Installing dependencies...";
      await loadDependencies(
        packageManager,
        limit,
        cache,
        resolver,
        lockfileManager
      );
    }

    await lockfileManager.save();
    spinner.succeed(chalk.green("Dependencies installed successfully!"));
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    spinner.fail(chalk.red(`Installation failed: ${errorMessage}`));
    throw error;
  }
}
