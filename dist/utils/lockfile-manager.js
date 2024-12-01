import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
export class LockfileManager {
    lockfilePath;
    data;
    constructor() {
        this.lockfilePath = join(process.cwd(), 'kydra-lock.json');
        this.data = {
            version: '1',
            dependencies: {}
        };
    }
    async load() {
        try {
            const content = await readFile(this.lockfilePath, 'utf-8');
            this.data = JSON.parse(content);
        }
        catch {
            // Lockfile doesn't exist, use default empty data
        }
    }
    async save() {
        await writeFile(this.lockfilePath, JSON.stringify(this.data, null, 2), 'utf-8');
    }
    addDependency(name, version, integrity, resolved) {
        this.data.dependencies[name] = { version, integrity, resolved };
    }
    getDependency(name) {
        return this.data.dependencies[name];
    }
    removeDependency(name) {
        delete this.data.dependencies[name];
    }
}
