import { ILoaderModule } from './ILoaderModule';
import {
    IModuleLoaderStrategy,
    IModuleLoaderRegistry,
    IModule
} from '../../BundleLoader';
import { IDependencyLocator } from '../../DependencyLocator';

export class LoaderModuleLoaderStrategy implements IModuleLoaderStrategy<typeof LoaderModuleLoaderStrategy.typeName> {

    public static readonly typeName = 'core.Loader';

    constructor(
        private readonly moduleLoaderRegistry: IModuleLoaderRegistry,
        private readonly locator: IDependencyLocator,
    ) { }

    getType(): typeof LoaderModuleLoaderStrategy.typeName {
        return LoaderModuleLoaderStrategy.typeName;
    }

    load(module: IModule<typeof LoaderModuleLoaderStrategy.typeName>): void {
        const type = module.getType();
        if (type !== LoaderModuleLoaderStrategy.typeName) {
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
