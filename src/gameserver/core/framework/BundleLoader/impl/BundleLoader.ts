import { IBundleLoader } from '../IBundleLoader';
import { IBundle } from '../IBundle';
import { IModule } from '../IModule';
import { IModuleLoaderStrategy } from '../IModuleLoaderStrategy';

export class BundleLoader implements IBundleLoader {

    private readonly moduleLoaderStrategies: Map<String, IModuleLoaderStrategy<String, IModule<String>>>;

    constructor(...moduleLoaderStrategies: IModuleLoaderStrategy<String, IModule<String>>[]) {
        this.moduleLoaderStrategies = new Map();

        for (let strategy of moduleLoaderStrategies) {
            const { type } = strategy;

            if (this.moduleLoaderStrategies.has(type)) {
                throw new Error(
                    `Attempting to load two IModuleLoaderStrategies ` +
                    `with the same type ${type}`
                );
            }
            this.moduleLoaderStrategies.set(type, strategy);
        }
    }

    loadBundle(bundle: IBundle): void {
        for (let module of bundle.modules) {
            const { type } = module;
            const loaderStrategy = this.moduleLoaderStrategies.get(type);

            if (loaderStrategy === undefined) {
                const strategies: String[] = [];

                for (let strategy of this.moduleLoaderStrategies.keys()) {
                    strategies.push(strategy)
                }

                throw new Error(
                    `Attempting to load module ${module.name} of type ${type} ` +
                    `from bundle ${bundle.name}, ` +
                    `but can't find matching ModuleLoaderStrategy. ` +
                    `Currently loaded ModuleLoaders:\n` +
                    strategies.map(type => `  ${type}`).join(`\n`)
                );
            }

            loaderStrategy.load(module);
        }
    }
}
