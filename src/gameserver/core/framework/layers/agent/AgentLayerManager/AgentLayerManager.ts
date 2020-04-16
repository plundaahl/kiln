import { ILayerManager } from '../../../mechanisms/LayerManager/ILayerManager';
import { LayerManager } from '../../../mechanisms/LayerManager/LayerManager';
import { IAgentManager } from './IAgentManager';
import { IPostWorldUpdateListener } from './IPostWorldUpdateListener';
import { IPreWorldUpdateListener } from './IPreWorldUpdateListener';
import { IDependencyRegistry, IDependencyLocator } from '../../../mechanisms/DependencyLocator';

export class AgentLayerManager
    extends LayerManager<IAgentManager>
    implements ILayerManager<IAgentManager> {

    public static readonly scope = 'core.AgentManager';

    constructor(
        dependencyLocator: IDependencyLocator & IDependencyRegistry,
        queryableScopes: string[],
    ) {
        super(dependencyLocator, AgentLayerManager.scope, queryableScopes);

        // this.onModuleInit = this.onModuleInit.bind(this);
        // this.getPostWorldUpdateListeners = this.getPostWorldUpdateListeners.bind(this);
        // this.getPreWorldUpdateListeners = this.getPreWorldUpdateListeners.bind(this);
    }

    private readonly onPreWorldUpdateListeners: IPreWorldUpdateListener[] = [];
    private readonly onPostWorldUpdateListeners: IPostWorldUpdateListener[] = [];

    protected onModuleInit(module: IAgentManager): void {
        if (module.onPreWorldUpdate !== undefined) {
            this.onPreWorldUpdateListeners.push(module as IPreWorldUpdateListener);
        }

        if (module.onPostWorldUpdate !== undefined) {
            this.onPostWorldUpdateListeners.push(module as IPostWorldUpdateListener);
        }
    }

    getPreWorldUpdateListeners(): IPreWorldUpdateListener[] {
        return this.onPreWorldUpdateListeners;
    }

    getPostWorldUpdateListeners(): IPostWorldUpdateListener[] {
        return this.onPostWorldUpdateListeners;
    }
}
