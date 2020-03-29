import { IModuleLoaderStrategy } from '../../BundleLoader';
import { IModule } from '../../BundleLoader';
import { ISystemModule } from './ISystemModule';
import { ISystemRegistry } from '../../DependencyLocator';

/**
 * Loads ISystemModules, registering their factories with the core
 * DependencyLocator, making them available inside the engine.
 */
export class SystemModuleLoaderStrategy implements IModuleLoaderStrategy<'system', IModule<'system'>> {

    /**
     * The type of IModule this ModuleLoaderStrategy loads.
     */
    public readonly type: 'system';

    constructor(
        private readonly dependencyLocator: ISystemRegistry,
    ) { }

    /**
     * Loads an ISystemModule. This registers it with the DependencyLocator.
     *
     * @param module an ISystemModule to load.
     * @throws if module is not a valid ISystemModule.
     */
    load(module: IModule<'system'>): void {
        const systemModule = this.validateModule(module);
        const { factory, identifiers } = systemModule;

        this.dependencyLocator.registerSystemFactory(factory, ...identifiers);
    }

    /**
     * Validates and casts an IModule to an ISystemModule, or errors if the
     * provided module cannot be validated.
     *
     * @param module IModule to validate
     * @throws if module is not valid ISystemModule
     */
    private validateModule(module: IModule<'system'>): ISystemModule<any> {
        if (module.type !== 'system') {
            throw new Error(`SystemModuleLoaderStrategy #load was passed module of type ${module.type}`);
        }

        const systemModule: ISystemModule<any> = module as ISystemModule<any>;
        if (systemModule.factory === undefined) {
            throw new Error(`Module ${module.name} contains no #factory() function`);
        }

        if (systemModule.identifiers === undefined) {
            throw new Error(`Module ${module.name} contains no #identifiers property`);
        }

        if (systemModule.identifiers.length === 0) {
            throw new Error(`Module ${module.name} must specify at least 1 identifier`);
        }

        return module as ISystemModule<any>;
    }

}
