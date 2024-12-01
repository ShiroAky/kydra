export declare class LockfileManager {
    private lockfilePath;
    private data;
    constructor();
    load(): Promise<void>;
    save(): Promise<void>;
    addDependency(name: string, version: string, integrity: string, resolved: string): void;
    getDependency(name: string): {
        version: string;
        integrity: string;
        resolved: string;
    };
    removeDependency(name: string): void;
}
