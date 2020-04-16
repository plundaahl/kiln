import { IBundleLoader } from '../IBundleLoader';
import { IBundle } from '../IBundle';
import { IModuleLoaderStrategy } from '../IModuleLoaderStrategy';
import { IModuleLoader } from '../IModuleLoader';
import { ModuleLoader } from './ModuleLoader';
import { IModuleLoaderRegistry } from '../IModuleLoaderRegistry';

export class BundleLoader implements IBundleLoader {

    constructor(
        private readonly moduleLoader: IModuleLoader & IModuleLoaderRegistry,
        ...moduleLoaderStrategies: IModuleLoaderStrategy<string>[]
    ) {

        for (let strategy of moduleLoaderStrategies) {
            this.moduleLoader.registerModuleLoaderStrategy(strategy);
        }
    }

    loadBundles(...bundles: IBundle[]): void {
        this.moduleLoader.loadModules(
            ...bundles.flatMap(bundle => bundle.getModules())
        );
    }
}
