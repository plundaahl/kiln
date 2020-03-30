import { IDependencyLocatorFacade, DependencyLocatorFacade } from './DependencyLocator';
import { ISystemManager, SystemManager } from './SystemManager';
import { IServiceManager, ServiceManager } from './ServiceManager';
import { Bundle } from './Bundle';
import {
    IBundleLoader,
    BundleLoader,
    IBundle,
} from './BundleLoader';
import {
    ServiceModuleLoaderStrategy,
    SystemModuleLoaderStrategy,
} from './ModuleLoaderStrategies';


export class Framework {
    private readonly dependencyLocator: IDependencyLocatorFacade;
    private readonly bundleLoader: IBundleLoader;
    private readonly systemManager: ISystemManager;
    private readonly serviceManager: IServiceManager;

    constructor(params: {
        bundles: Bundle[],
    }) {
        this.dependencyLocator = new DependencyLocatorFacade();

        this.systemManager = new SystemManager(this.dependencyLocator);
        this.serviceManager = new ServiceManager(this.dependencyLocator);

        this.bundleLoader = new BundleLoader(
            new ServiceModuleLoaderStrategy(
                this.dependencyLocator,
                this.serviceManager.notifyServiceRegistered,
            ),
            new SystemModuleLoaderStrategy(
                this.dependencyLocator,
                this.systemManager.notifySystemRegistered,
            ),
        );

        this.loadBundles(params.bundles);
        this.initializeAllModules();
    }

    private loadBundles(bundles: IBundle[]): void {
        for (let bundle of bundles) {
            this.bundleLoader.loadBundle(bundle);
        }
    }

    private initializeAllModules(): void {
        this.systemManager.initializeAllSystems();
        this.serviceManager.initializeAllServices();
    }
}
