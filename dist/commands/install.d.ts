interface InstallOptions {
    saveDev?: boolean;
}
export declare function install(packageName?: string, options?: InstallOptions): Promise<void>;
export {};
