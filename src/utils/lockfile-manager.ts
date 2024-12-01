import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface LockfileData {
  version: string;
  dependencies: Record<string, {
    version: string;
    integrity: string;
    resolved: string;
  }>;
}

export class LockfileManager {
  private lockfilePath: string;
  private data: LockfileData;

  constructor() {
    this.lockfilePath = join(process.cwd(), 'kydra-lock.json');
    this.data = {
      version: '1',
      dependencies: {}
    };
  }

  async load(): Promise<void> {
    try {
      const content = await readFile(this.lockfilePath, 'utf-8');
      this.data = JSON.parse(content);
    } catch {
      // Lockfile doesn't exist, use default empty data
    }
  }

  async save(): Promise<void> {
    await writeFile(
      this.lockfilePath,
      JSON.stringify(this.data, null, 2),
      'utf-8'
    );
  }

  addDependency(name: string, version: string, integrity: string, resolved: string): void {
    this.data.dependencies[name] = { version, integrity, resolved };
  }

  getDependency(name: string) {
    return this.data.dependencies[name];
  }

  removeDependency(name: string): void {
    delete this.data.dependencies[name];
  }
}