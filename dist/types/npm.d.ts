export interface NpmPackageVersion {
    version: string;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
    dist: {
        tarball: string;
        integrity: string;
    };
}
export interface NpmPackageMetadata {
    'dist-tags': {
        latest: string;
        [tag: string]: string;
    };
    versions: Record<string, NpmPackageVersion>;
}
