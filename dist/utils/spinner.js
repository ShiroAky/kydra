import ora from 'ora';
import chalk from 'chalk';
export function createSpinner(text) {
    const spinner = ora({
        text,
        spinner: 'dots',
        color: 'cyan'
    });
    return {
        start: (newText) => {
            spinner.text = newText || text;
            spinner.start();
        },
        succeed: (message) => {
            spinner.succeed(chalk.green(message));
        },
        fail: (message) => {
            spinner.fail(chalk.red(message));
        }
    };
}
