import { IModule } from '../IModule';
import { IModuleLoader } from '../IModuleLoader';
import { IModuleLoaderRegistry } from '../IModuleLoaderRegistry';
import { IModuleLoaderStrategy } from '../IModuleLoaderStrategy';

export class ModuleLoader implements IModuleLoader, IModuleLoaderRegistry {

    private readonly moduleLoaders: IModuleLoaderStrategy<string>[] = [];
    private readonly modulesLoaded: Set<string> = new Set();

    loadModules(...modules: IModule<string>[]): void {
        const modulesByCategory = categorizeModules(modules);

        for (let loader of this.moduleLoaders) {
            const type = loader.getType();

            for (let module of modulesByCategory.get(type) || []) {

                const coordinates = buildModuleCoordinates(module);
                if (this.modulesLoaded.has(coordinates)) {
                    throw new Error(buildDuplicateModuleErrorMsg(module))
                }

                this.modulesLoaded.add(coordinates);
                loader.load(module);
            }

            modulesByCategory.delete(type);
        }

        if (modulesByCategory.size > 0) {
            throw new Error(buildMissingModuleLoaderStrategyErrorMsg(modulesByCategory, this.moduleLoaders));
        }
    }

    registerModuleLoaderStrategy(loader: IModuleLoaderStrategy<string>): void {
        const type = loader.getType();
        if (this.moduleLoaders.find(loader => loader.getType() === type)) {
            throw new Error(buildDuplicateTypeErrorMsg(type));
        }
        this.moduleLoaders.push(loader);
    }
}

function categorizeModules(modules: IModule<string>[]): Map<string, IModule<string>[]> {
    const modulesByCategory = new Map<string, IModule<string>[]>();

    for (let module of modules) {
        const type = module.getType();
        const modulesOfType = modulesByCategory.get(type) || [];

        modulesOfType.push(module);

        modulesByCategory.set(type, modulesOfType);
    }

    return modulesByCategory;
}

function buildModuleCoordinates(module: IModule<string>): string {
    return `${module.getName()} (${module.getType()})`;
}

function buildDuplicateTypeErrorMsg(type: string): string {
    return `You are trying to register a ModuleLoaderStrategy type ` +
        `${type}, but there is already a ModuleLoaderStrategy ` +
        `registered with that type.`
}

function buildDuplicateModuleErrorMsg(module: IModule<string>): string {
    return `You are trying to register duplicate module: ` +
        `${buildModuleCoordinates(module)}. A module with this name  and ` +
        `type has already been loaded.`
}

function buildMissingModuleLoaderStrategyErrorMsg(
    modulesByType: Map<string, IModule<string>[]>,
    currentLoaders: IModuleLoaderStrategy<string>[],
) {
    const unloadedModules: string[] = [];
    const missingModuleLoaderTypes: string[] = [];
    const currentModuleLoaderTypes: string[] = [];

    for (let [type, moduleList] of modulesByType.entries()) {
        missingModuleLoaderTypes.push(`- ${type}\n`);
        for (let module of moduleList) {
            unloadedModules.push(`- ${module.getName()} of type ${module.getType()}`);
        }
    }

    for (let loader of currentLoaders) {
        currentModuleLoaderTypes.push(`- ${loader.getType()}`);
    }

    return `Failed to load the follow modules:\n` +
        unloadedModules.sort().join('') +
        `No ModuleLoaderStrategies registered for the following module types: \n` +
        missingModuleLoaderTypes.sort().join('') +
        `Currently registered loaders: \n` +
        currentModuleLoaderTypes.sort().join('');
}
