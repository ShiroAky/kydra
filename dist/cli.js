#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import gradient from 'gradient-string';
import figlet from 'figlet';
import { install } from './commands/install.js';
import { init } from './commands/init.js';
import { update } from './commands/update.js';
import { remove } from './commands/remove.js';
import { run } from './commands/run.js';
import { create } from './commands/create.js';
import { bump } from './commands/bump.js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
// Display fancy banner
console.log(gradient.pastel.multiline(figlet.textSync('Kydra', {
    font: 'Big',
    horizontalLayout: 'full'
})));
const program = new Command();
program
    .name('kd')
    .description('Kydra - A blazing-fast package manager for Node.js')
    .version(pkg.version);
program
    .command('install [package]')
    .alias('i')
    .description('Install dependencies')
    .option('-D, --save-dev', 'Install as dev dependency')
    .action(async (pkg, options) => {
    try {
        await install(pkg, options);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('init [name]')
    .description('Initialize a new project')
    .action(async (name) => {
    try {
        await init(name);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('create <template> [name]')
    .description('Create a new project (e.g., kd create vite@latest my-app)')
    .action(async (template, name) => {
    try {
        await create(template, name);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('update')
    .description('Update dependencies')
    .action(async () => {
    try {
        await update();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('remove <package>')
    .alias('rm')
    .description('Remove a package')
    .action(async (pkg) => {
    try {
        await remove(pkg);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('run <script>')
    .description('Run a script defined in package.json')
    .action(async (script) => {
    try {
        await run(script);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program
    .command('bump [type]')
    .description('Bump version (patch|minor|major)')
    .action(async (type = 'patch') => {
    try {
        await bump(type);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(chalk.red(`Error: ${errorMessage}`));
        process.exit(1);
    }
});
program.parse();
