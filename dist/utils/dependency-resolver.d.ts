export declare class DependencyResolver {
    private visited;
    private dependencies;
    private readonly registryUrl;
    resolve(packageName: string, version: string): Promise<Map<string, string>>;
    private resolveDependency;
    private resolveVersion;
    private fetchPackageMetadata;
}
