import semver from 'semver';
import fetch from 'node-fetch';
import { NpmPackageMetadata } from '../types/npm.js';

export class DependencyResolver {
  private visited = new Set<string>();
  private dependencies = new Map<string, string>();
  private readonly registryUrl = 'https://registry.npmjs.org';

  async resolve(packageName: string, version: string): Promise<Map<string, string>> {
    this.visited.clear();
    this.dependencies.clear();

    await this.resolveDependency(packageName, version);
    return this.dependencies;
  }

  private async resolveDependency(packageName: string, version: string): Promise<void> {
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

      await Promise.all(
        Object.entries(deps || {}).map(([dep, range]) => 
          this.resolveDependency(dep, range || 'latest')
        )
      );
    } catch (error) {
      throw new Error(`Failed to resolve ${packageName}@${version}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async resolveVersion(metadata: NpmPackageMetadata, range: string): Promise<string | null> {
    if (range === 'latest') {
      return metadata['dist-tags'].latest;
    }

    const versions = Object.keys(metadata.versions);
    return semver.maxSatisfying(versions, range);
  }

  private async fetchPackageMetadata(packageName: string): Promise<NpmPackageMetadata> {
    const response = await fetch(`${this.registryUrl}/${packageName}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch package metadata: ${response.statusText}`);
    }

    const data = await response.json() as NpmPackageMetadata;
    
    if (!data.versions || !data['dist-tags']) {
      throw new Error(`Invalid package metadata for ${packageName}`);
    }

    return data;
  }
}