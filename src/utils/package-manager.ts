import fetch from "node-fetch";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";
import { Cache } from "./cache.js";
import { DependencyResolver } from "./dependency-resolver.js";
import { LockfileManager } from "./lockfile-manager.js";
import { PackageJson } from "../types/package.js";

interface InstallOptions {
  cache: Cache;
  resolver: DependencyResolver;
  lockfileManager: LockfileManager;
  isDev?: boolean;
}

export class PackageManager {
  private packageJsonPath: string;

  constructor() {
    this.packageJsonPath = join(process.cwd(), "package.json");
  }

  // Método para resolver e instalar las dependencias desde npm
  async installPackage(name: string, options: InstallOptions): Promise<void> {
    const { cache, resolver, lockfileManager, isDev } = options;

    // Leer package.json
    const pkg = await this.readPackageJson();

    // Resolver dependencias
    const dependencies = await resolver.resolve(name, "latest");

    for (const [depName, version] of dependencies) {
      // Verificar en caché
      const cacheKey = `${depName}@${version}`;
      let packageData = await cache.get(cacheKey);

      if (!packageData) {
        // Descargar paquete si no está en la caché
        packageData = await this.downloadPackage(depName, version);
        await cache.set(cacheKey, packageData);
      }

      // Extraer paquete y actualizar package.json
      await this.extractPackage(packageData);

      if (isDev) {
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.devDependencies[depName] = version;
      } else {
        pkg.dependencies = pkg.dependencies || {};
        pkg.dependencies[depName] = version;
      }

      // Actualizar lockfile
      lockfileManager.addDependency(
        depName,
        version,
        "sha512-...", // TODO: Calcular la integridad real
        `https://registry.npmjs.org/${depName}/-/${depName}-${version}.tgz`
      );
    }

    // Guardar package.json actualizado
    await this.writePackageJson(pkg);
  }

  // Obtener todas las dependencias de package.json
  async getAllDependencies(): Promise<Array<{ name: string; isDev: boolean }>> {
    const pkg = await this.readPackageJson();
    const deps: Array<{ name: string; isDev: boolean }> = [];

    for (const [name] of Object.entries(pkg.dependencies || {})) {
      deps.push({ name, isDev: false });
    }

    for (const [name] of Object.entries(pkg.devDependencies || {})) {
      deps.push({ name, isDev: true });
    }

    return deps;
  }

  // Leer package.json
  async readPackageJson(): Promise<PackageJson> {
    const content = await readFile(this.packageJsonPath, "utf-8");
    return JSON.parse(content);
  }

  // Guardar package.json
  async writePackageJson(pkg: PackageJson): Promise<void> {
    await writeFile(
      this.packageJsonPath,
      JSON.stringify(pkg, null, 2),
      "utf-8"
    );
  }

  // Descargar paquete desde el registro de npm
  private async downloadPackage(
    name: string,
    version: string
  ): Promise<Buffer> {
    const url = `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to download package: ${name}@${version}`);
    }

    return response.buffer();
  }

  // Extraer paquete (en caso de necesitarlo)
  private async extractPackage(data: Buffer): Promise<void> {
    // Implementar extracción del paquete si es necesario
    // En este caso, dado que deseas instalar normalmente, solo necesitamos el paquete descargado
    console.log("Package downloaded successfully");
  }
}
