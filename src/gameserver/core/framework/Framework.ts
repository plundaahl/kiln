import { DependencyLocator, IDependencyLocator, IDependencyRegistry } from './DependencyLocator';
import {
    BundleLoader,
    ModuleLoader,
    IBundleLoader,
    IBundle,
} from './BundleLoader';
import { ILayerManager, LayerManager } from './LayerManager';
import { LayerComponentModuleLoaderStrategy } from './ModuleLoaderStrategies';
import { GameLoopRunner } from './GameLoopRunner';

const TICKS_PER_SECOND = 20;
const SYSTEM = 'system';
const SERVICE = 'service';
const CONTROLLER = 'controller';

export class Framework {
    private readonly dependencyLocator: IDependencyRegistry & IDependencyLocator;
    private readonly bundleLoader: IBundleLoader;
    private readonly gameLoopRunner: GameLoopRunner;
    private readonly systemManager: ILayerManager;
    private readonly serviceManager: ILayerManager;
    private readonly controllerManager: ILayerManager;

    constructor(params: {
        bundles: IBundle[],
    }) {
        this.dependencyLocator = new DependencyLocator();

        this.systemManager = new LayerManager(this.dependencyLocator, SYSTEM, [SYSTEM]);
        this.serviceManager = new LayerManager(this.dependencyLocator, SERVICE, [SYSTEM]);
        this.controllerManager = new LayerManager(this.dependencyLocator, CONTROLLER, [SERVICE]);

        this.bundleLoader = new BundleLoader(
            new ModuleLoader(),
            new LayerComponentModuleLoaderStrategy(this.systemManager, SYSTEM),
            new LayerComponentModuleLoaderStrategy(this.serviceManager, SERVICE),
            new LayerComponentModuleLoaderStrategy(this.controllerManager, CONTROLLER),
        );

        this.loadBundles(params.bundles);
        this.initializeAllModules();

        this.gameLoopRunner = new GameLoopRunner(this.dependencyLocator, TICKS_PER_SECOND, []);
        this.gameLoopRunner.start();
    }

    private loadBundles(bundles: IBundle[]): void {
        for (let bundle of bundles) {
            this.bundleLoader.loadBundles(bundle);
        }
    }

    private initializeAllModules(): void {
        this.systemManager.initModules();
        this.serviceManager.initModules();
        this.controllerManager.initModules();
    }
}
