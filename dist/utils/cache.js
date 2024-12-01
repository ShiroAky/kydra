import cacache from 'cacache';
import { join } from 'path';
import { homedir } from 'os';
export class Cache {
    cachePath;
    constructor() {
        this.cachePath = join(homedir(), '.kydra', 'cache');
    }
    async get(key) {
        try {
            const { data } = await cacache.get(this.cachePath, key);
            return data;
        }
        catch {
            return null;
        }
    }
    async set(key, data) {
        await cacache.put(this.cachePath, key, data);
    }
    async has(key) {
        try {
            await cacache.get.info(this.cachePath, key);
            return true;
        }
        catch {
            return false;
        }
    }
    async clear() {
        await cacache.rm.all(this.cachePath);
    }
}
