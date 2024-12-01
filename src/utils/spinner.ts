import ora from 'ora';
import chalk from 'chalk';

export function createSpinner(text: string) {
  const spinner = ora({
    text,
    spinner: 'dots',
    color: 'cyan'
  });

  return {
    start: (newText?: string) => {
      spinner.text = newText || text;
      spinner.start();
    },
    succeed: (message: string) => {
      spinner.succeed(chalk.green(message));
    },
    fail: (message: string) => {
      spinner.fail(chalk.red(message));
    }
  };
}