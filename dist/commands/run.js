import chalk from 'chalk';
import { spawn } from 'child_process';
import { PackageManager } from '../utils/package-manager.js';
export async function run(scriptName) {
    try {
        const packageManager = new PackageManager();
        const pkg = await packageManager.readPackageJson();
        if (!pkg.scripts?.[scriptName]) {
            throw new Error(`Script "${scriptName}" not found in package.json`);
        }
        const command = pkg.scripts[scriptName];
        const [cmd, ...args] = command.split(' ');
        const child = spawn(cmd, args, {
            stdio: 'inherit',
            shell: true
        });
        return new Promise((resolve, reject) => {
            child.on('error', reject);
            child.on('exit', code => {
                if (code === 0) {
                    resolve();
                }
                else {
                    reject(new Error(`Script "${scriptName}" failed with exit code ${code}`));
                }
            });
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        throw error;
    }
}
