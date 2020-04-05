import { IDependencyLocatorFacade, DependencyLocatorFacade } from './DependencyLocator';
import { ISystemManager, SystemManager } from './SystemManager';
import { IServiceManager, ServiceManager } from './ServiceManager';
import {
    BundleLoader,
    ModuleLoader,
    IBundleLoader,
    IBundle,
} from './BundleLoader';
import {
    LoaderModuleLoaderStrategy,
    ServiceModuleLoaderStrategy,
    SystemModuleLoaderStrategy,
} from './ModuleLoaderStrategies';

export class Framework {
    private readonly dependencyLocator: IDependencyLocatorFacade;
    private readonly bundleLoader: IBundleLoader;
    private readonly systemManager: ISystemManager;
    private readonly serviceManager: IServiceManager;

    constructor(params: {
        bundles: IBundle[],
    }) {
        this.dependencyLocator = new DependencyLocatorFacade();

        this.systemManager = new SystemManager(this.dependencyLocator);
        this.serviceManager = new ServiceManager(this.dependencyLocator);

        this.bundleLoader = this.createBundleLoader();
        this.loadBundles(params.bundles);
        this.initializeAllModules();
    }

    private createBundleLoader(): BundleLoader {
        const moduleLoader = new ModuleLoader();
        return new BundleLoader(
            moduleLoader,
            new LoaderModuleLoaderStrategy(
                moduleLoader,
                this.dependencyLocator,
            ),
            new ServiceModuleLoaderStrategy(
                this.dependencyLocator,
                this.serviceManager.notifyServiceRegistered,
            ),
            new SystemModuleLoaderStrategy(
                this.dependencyLocator,
                this.systemManager.notifySystemRegistered,
            ),
        );
    }

    private loadBundles(bundles: IBundle[]): void {
        for (let bundle of bundles) {
            this.bundleLoader.loadBundles(bundle);
        }
    }

    private initializeAllModules(): void {
        this.systemManager.initializeAllSystems();
        this.serviceManager.initializeAllServices();
    }
}
