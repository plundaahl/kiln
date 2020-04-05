import { IModuleLoaderStrategy } from '../../BundleLoader';
import { IModule } from '../../BundleLoader';
import { IServiceModule } from './IServiceModule';
import {
    IServiceRegistry,
    TypedIdentifier,
} from '../../DependencyLocator';

/**
 * Loads IServiceModules, registering their factories with the core
 * DependencyLocator, making them available as services inside the engine.
 */
export class ServiceModuleLoaderStrategy implements IModuleLoaderStrategy<'service'> {

    /**
     * The type of IModule this ModuleLoaderStrategy loads.
     */
    public getType(): 'service' {
        return 'service';
    };

    constructor(
        private readonly dependencyLocator: IServiceRegistry,
        private readonly onServiceLoaded: (identifier: TypedIdentifier<any>) => void,
    ) { }

    /**
     * Loads an IServiceModule. This registers it with the DependencyLocator.
     *
     * @param module an IServiceModule to load.
     * @throws if module is not a valid IServiceModule.
     */
    load(module: IModule<'service'>): void {
        const systemModule = this.validateModule(module);
        const { factory, identifiers } = systemModule;

        this.dependencyLocator.registerServiceFactory(factory, ...identifiers);

        this.onServiceLoaded(identifiers[0]);
    }

    /**
     * Validates and casts an IModule to an IServiceModule, or errors if the
     * provided module cannot be validated.
     *
     * @param module IModule to validate
     * @throws if module is not valid IServiceModule
     */
    private validateModule(module: IModule<'service'>): IServiceModule<any> {
        const type = module.getType();
        if (type !== 'service') {
            throw new Error(`SystemModuleLoaderStrategy #load was passed module of type ${type}`);
        }

        const serviceModule: IServiceModule<any> = module as IServiceModule<any>;
        if (serviceModule.factory === undefined) {
            throw new Error(`Module ${module.getName()} contains no #factory() function`);
        }

        if (serviceModule.identifiers === undefined) {
            throw new Error(`Module ${module.getName()} contains no #identifiers property`);
        }

        if (serviceModule.identifiers.length === 0) {
            throw new Error(`Module ${module.getName()} must specify at least 1 identifier`);
        }

        return module as IServiceModule<any>;
    }

}
