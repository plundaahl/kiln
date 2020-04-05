import { ILoaderModule } from './ILoaderModule';
import {
    IModuleLoaderStrategy,
    IModuleLoaderRegistry,
    IModule
} from '../../BundleLoader';
import {
    IServiceLocator,
    ISystemLocator,
} from '../../DependencyLocator';

const typeName = 'loader';

export class LoaderModuleLoaderStrategy implements IModuleLoaderStrategy<'loader'> {
    constructor(
        private readonly moduleLoaderRegistry: IModuleLoaderRegistry,
        private readonly locator: IServiceLocator & ISystemLocator,
    ) { }

    getType(): 'loader' {
        return typeName;
    }

    load(module: IModule<'loader'>): void {
        const type = module.getType();
        if (type !== typeName) {
            throw new Error(`LoaderModuleLoaderStrategy #load was passed module of type ${type}`);
        }

        const loaderModule: ILoaderModule = module as ILoaderModule;
        if (loaderModule.createLoader === undefined) {
            throw new Error(`Module ${module.getName()} contains no #createLoader() function`);
        }

        const loaderStrategy = loaderModule.createLoader(this.locator);
        this.moduleLoaderRegistry.registerModuleLoaderStrategy(loaderStrategy);
    }
}
