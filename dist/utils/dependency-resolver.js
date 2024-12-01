import semver from 'semver';
import fetch from 'node-fetch';
export class DependencyResolver {
    visited = new Set();
    dependencies = new Map();
    registryUrl = 'https://registry.npmjs.org';
    async resolve(packageName, version) {
        this.visited.clear();
        this.dependencies.clear();
        await this.resolveDependency(packageName, version);
        return this.dependencies;
    }
    async resolveDependency(packageName, version) {
        const key = `${packageName}@${version}`;
        if (this.visited.has(key)) {
            return;
        }
        this.visited.add(key);
        try {
            const metadata = await this.fetchPackageMetadata(packageName);
            const resolvedVersion = await this.resolveVersion(metadata, version);
            if (!resolvedVersion) {
                throw new Error(`No version found for ${packageName}@${version}`);
            }
            this.dependencies.set(packageName, resolvedVersion);
            const versionData = metadata.versions[resolvedVersion];
            const deps = { ...versionData.dependencies, ...versionData.peerDependencies };
            await Promise.all(Object.entries(deps || {}).map(([dep, range]) => this.resolveDependency(dep, range || 'latest')));
        }
        catch (error) {
            throw new Error(`Failed to resolve ${packageName}@${version}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async resolveVersion(metadata, range) {
        if (range === 'latest') {
            return metadata['dist-tags'].latest;
        }
        const versions = Object.keys(metadata.versions);
        return semver.maxSatisfying(versions, range);
    }
    async fetchPackageMetadata(packageName) {
        const response = await fetch(`${this.registryUrl}/${packageName}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch package metadata: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.versions || !data['dist-tags']) {
            throw new Error(`Invalid package metadata for ${packageName}`);
        }
        return data;
    }
}
