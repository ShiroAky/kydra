import chalk from 'chalk';
import { execa } from 'execa';
import boxen from 'boxen';
import { createSpinner } from '../utils/spinner.js';
export async function create(template, name) {
    const spinner = createSpinner('Creating new project...');
    try {
        if (!template) {
            throw new Error('Template is required. Example: kd create vite@latest my-app');
        }
        const projectName = name || 'my-app';
        spinner.start(`Creating project with ${template}...`);
        // Execute the create command
        await execa('npm', ['create', template, projectName, '--', '--yes'], {
            stdio: 'inherit'
        });
        spinner.succeed(chalk.green(`Successfully created project: ${projectName}`));
        // Show project info in a nice box
        console.log(boxen(chalk.green(`Project "${projectName}" created successfully!\n\n`) +
            chalk.white(`Template: ${template}\n`) +
            chalk.white(`Location: ${process.cwd()}/${projectName}\n\n`) +
            chalk.cyan('Next steps:\n') +
            chalk.white(`1. cd ${projectName}\n`) +
            chalk.white('2. npm install\n') +
            chalk.white('3. npm run dev'), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
        }));
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        spinner.fail(`Creation failed: ${errorMessage}`);
        throw error;
    }
}
