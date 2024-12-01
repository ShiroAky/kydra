import inquirer from "inquirer";
import { writeFile } from "fs/promises";
import { join } from "path";
import { createSpinner } from "../utils/spinner.js";
export async function init(projectName) {
    const spinner = createSpinner("Initializing new project...");
    try {
        // Get project details through interactive prompts
        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Project name:",
                default: projectName || "my-project",
                validate: (input) => input.length > 0,
            },
            {
                type: "input",
                name: "description",
                message: "Description:",
                default: "",
            },
            {
                type: "list",
                name: "language",
                message: "Choose language:",
                choices: ["index.ts", "index.js"],
            },
            {
                type: "input",
                name: "author",
                message: "Author:",
                default: "",
            },
        ]);
        spinner.start("Creating project files...");
        const packageJson = {
            name: answers.name,
            version: "1.0.0",
            description: answers.description,
            main: answers.language,
            scripts: {
                test: 'echo "Error: no test specified" && exit 1',
                start: answers.language === "TypeScript"
                    ? "ts-node src/index.ts"
                    : "node src/index.js",
            },
            keywords: [],
            author: answers.author,
            license: "MIT",
        };
        // Create package.json
        await writeFile(join(process.cwd(), "package.json"), JSON.stringify(packageJson, null, 2));
        // Create kydra-lock.json
        await writeFile(join(process.cwd(), "kydra-lock.json"), JSON.stringify({
            version: "1",
            dependencies: {},
        }, null, 2));
        // Create config file based on language choice
        if (answers.language === "index.ts") {
            await writeFile(join(process.cwd(), "tsconfig.json"), JSON.stringify({
                compilerOptions: {
                    target: "ES2022",
                    module: "ESNext",
                    moduleResolution: "node",
                    outDir: "./dist",
                    rootDir: "./src",
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                },
                include: ["src/**/*"],
                exclude: ["node_modules", "dist"],
            }, null, 2));
        }
        else {
            await writeFile(join(process.cwd(), "jsconfig.json"), JSON.stringify({
                compilerOptions: {
                    module: "ESNext",
                    moduleResolution: "node",
                    target: "ES2022",
                    strict: true,
                    esModuleInterop: true,
                    skipLibCheck: true,
                    forceConsistentCasingInFileNames: true,
                },
                exclude: ["node_modules", "dist"],
            }, null, 2));
        }
        // Create config file based on language choice
        if (answers.language === "TypeScript") {
            await writeFile(join(process.cwd(), "index.ts"), `console.log("Welcome to Kydra");` // Write the content into the file
            );
        }
        else {
            await writeFile(join(process.cwd(), "index.js"), `console.log("Welcome to kydra");` // Write the content into the file
            );
        }
        spinner.succeed("Project initialized successfully!");
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
        spinner.fail(`Initialization failed: ${errorMessage}`);
        throw error;
    }
}
