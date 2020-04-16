import { DependencyLocator, IDependencyLocator, IDependencyRegistry } from './mechanisms/DependencyLocator';
import {
    BundleLoader,
    ModuleLoader,
    IBundleLoader,
    IBundle,
} from './mechanisms/BundleLoader';
import {
    ILayerManager,
    LayerManager,
    SystemManager,
    IUpdatableSystem,
    IAgentManager,
    AgentLayerManager,
} from './layers';
import { LayerComponentModuleLoaderStrategy } from './mechanisms/ModuleLoaderStrategies';
import { GameLoopRunner, IUpdatableEntry } from './mechanisms/GameLoopRunner';
import { TypedIdentifier } from './mechanisms/TypedIdentifier';

const TICKS_PER_SECOND = 20;
const SYSTEM = 'system';
const SERVICE = 'service';

export class Framework {
    private readonly dependencyLocator: IDependencyRegistry & IDependencyLocator;
    private readonly bundleLoader: IBundleLoader;
    private readonly gameLoopRunner: GameLoopRunner;
    private readonly systemManager: SystemManager;
    private readonly serviceManager: ILayerManager<IUpdatableSystem>;
    private readonly agentLayerManager: ILayerManager<IAgentManager>;

    constructor(params: {
        bundles: IBundle[],
        systemUpdateOrder: TypedIdentifier<IUpdatableSystem>[],
    }) {
        this.dependencyLocator = new DependencyLocator();

        this.systemManager = new SystemManager(this.dependencyLocator, params.systemUpdateOrder);
        this.serviceManager = new LayerManager(this.dependencyLocator, SERVICE, [SYSTEM]);
        this.agentLayerManager = new AgentLayerManager(this.dependencyLocator, [SERVICE]);

        this.bundleLoader = new BundleLoader(
            new ModuleLoader(),
            new LayerComponentModuleLoaderStrategy<typeof SYSTEM, IUpdatableSystem>(
                this.systemManager,
                SYSTEM,
            ),
            new LayerComponentModuleLoaderStrategy(this.serviceManager, SERVICE),
            new LayerComponentModuleLoaderStrategy(
                this.agentLayerManager,
                AgentLayerManager.scope,
            ),
        );

        this.loadBundles(params.bundles);
        this.initializeAllModules();

        this.gameLoopRunner = new GameLoopRunner(
            { ticksPerSecond: TICKS_PER_SECOND },
            [
                ...(
                    this.systemManager
                        .getUpdatableSystems()
                        .map(
                            system => ([system, 'update'] as IUpdatableEntry<'update'>)
                        )
                ),
            ],
        );
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
        this.agentLayerManager.initModules();
    }
}
