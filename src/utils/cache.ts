import cacache from 'cacache';
import { join } from 'path';
import { homedir } from 'os';

export class Cache {
  private cachePath: string;

  constructor() {
    this.cachePath = join(homedir(), '.kydra', 'cache');
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      const { data } = await cacache.get(this.cachePath, key);
      return data;
    } catch {
      return null;
    }
  }

  async set(key: string, data: Buffer): Promise<void> {
    await cacache.put(this.cachePath, key, data);
  }

  async has(key: string): Promise<boolean> {
    try {
      await cacache.get.info(this.cachePath, key);
      return true;
    } catch {
      return false;
    }
  }

  async clear(): Promise<void> {
    await cacache.rm.all(this.cachePath);
  }
}