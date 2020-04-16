import { DependencyLocator, IDependencyLocator, IDependencyRegistry } from './mechanisms/DependencyLocator';
import {
    BundleLoader,
    ModuleLoader,
    IBundleLoader,
    IBundle,
} from './mechanisms/BundleLoader';
import {
    AgentLayerManager,
    ServiceManager,
    SystemManager,
    IAgentManager,
    IService,
    ISystem,
    IUpdatableSystem,
} from './layers';
import { LayerComponentModuleLoaderStrategy } from './mechanisms/ModuleLoaderStrategies';
import { GameLoopRunner, IUpdatableEntry } from './mechanisms/GameLoopRunner';
import { TypedIdentifier } from './mechanisms/TypedIdentifier';

const TICKS_PER_SECOND = 20;

export class Framework {
    private readonly dependencyLocator: IDependencyRegistry & IDependencyLocator;
    private readonly bundleLoader: IBundleLoader;
    private readonly gameLoopRunner: GameLoopRunner;
    private readonly systemManager: SystemManager;
    private readonly serviceManager: ServiceManager;
    private readonly agentLayerManager: AgentLayerManager;

    constructor(params: {
        bundles: IBundle[],
        systemUpdateOrder: TypedIdentifier<IUpdatableSystem>[],
    }) {
        this.dependencyLocator = new DependencyLocator();
        this.systemManager = new SystemManager(this.dependencyLocator, params.systemUpdateOrder);
        this.serviceManager = new ServiceManager(this.dependencyLocator, [SystemManager.scope]);
        this.agentLayerManager = new AgentLayerManager(this.dependencyLocator, [ServiceManager.scope]);

        this.bundleLoader = new BundleLoader(
            new ModuleLoader(),

            new LayerComponentModuleLoaderStrategy<typeof SystemManager.scope, ISystem>(
                this.systemManager,
                SystemManager.scope,
            ),

            new LayerComponentModuleLoaderStrategy<typeof ServiceManager.scope, IService>(
                this.serviceManager,
                ServiceManager.scope,
            ),

            new LayerComponentModuleLoaderStrategy<typeof AgentLayerManager.scope, IAgentManager>(
                this.agentLayerManager,
                AgentLayerManager.scope,
            ),
        );

        this.loadBundles(params.bundles);
        this.initializeAllModules();

        this.gameLoopRunner = new GameLoopRunner(
            { ticksPerSecond: TICKS_PER_SECOND },
            [
                ...this.getAgentPreWorldUpdateListeners(),
                ...this.getUpdatableSystems(),
                ...this.getAgentPostWorldUpdateListeners(),
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

    private getUpdatableSystems(): IUpdatableEntry<'update'>[] {
        return this
            .systemManager
            .getUpdatableSystems()
            .map(system => ([system, 'update']));
    }

    private getAgentPreWorldUpdateListeners(): IUpdatableEntry<'onPreWorldUpdate'>[] {
        return this
            .agentLayerManager
            .getPreWorldUpdateListeners()
            .map(agentManager => [agentManager, 'onPreWorldUpdate']);
    }

    private getAgentPostWorldUpdateListeners(): IUpdatableEntry<'onPostWorldUpdate'>[] {
        return this
            .agentLayerManager
            .getPostWorldUpdateListeners()
            .map(agentManager => [agentManager, 'onPostWorldUpdate']);
    }
}
