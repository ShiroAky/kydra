import chalk from "chalk";
import { execa } from "execa";
import { createSpinner } from "../utils/spinner.js";

export async function create(template: string, name?: string): Promise<void> {
  const spinner = createSpinner("Creating new project...");

  try {
    if (!template) {
      throw new Error(
        "Template is required. Example: kd create vite@latest my-app"
      );
    }

    const projectName = name || "my-app";
    spinner.start(`Creating project with ${template}...`);

    // Execute the create command
    await execa("npm", ["create", template, projectName], {
      stdio: "inherit",
    });

    spinner.succeed(
      chalk.green(`Successfully created project: ${projectName}`)
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    spinner.fail(`Creation failed: ${errorMessage}`);
    throw error;
  }
}
