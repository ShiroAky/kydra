export declare class Cache {
    private cachePath;
    constructor();
    get(key: string): Promise<Buffer | null>;
    set(key: string, data: Buffer): Promise<void>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
}
