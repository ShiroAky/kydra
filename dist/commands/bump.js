import chalk from 'chalk';
import semver from 'semver';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { createSpinner } from '../utils/spinner.js';
export async function bump(type) {
    const spinner = createSpinner('Bumping version...');
    try {
        const packageJsonPath = join(process.cwd(), 'package.json');
        const content = await readFile(packageJsonPath, 'utf-8');
        const pkg = JSON.parse(content);
        const currentVersion = pkg.version;
        const newVersion = semver.inc(currentVersion, type);
        if (!newVersion) {
            throw new Error('Invalid version increment');
        }
        pkg.version = newVersion;
        await writeFile(packageJsonPath, JSON.stringify(pkg, null, 2));
        spinner.succeed(chalk.green(`Version bumped from ${currentVersion} to ${newVersion}`));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        spinner.fail(`Version bump failed: ${errorMessage}`);
        throw error;
    }
}
