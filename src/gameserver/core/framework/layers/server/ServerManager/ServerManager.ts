import { IServerController } from './IServer';
import { ILayerManager, LayerManager } from '../../../mechanisms/LayerManager';
import { IDependencyLocator, IDependencyRegistry } from '../../../mechanisms/DependencyLocator';

export class ServerManager
    extends LayerManager<IServerController>
    implements ILayerManager<IServerController> {

    public static readonly scope = 'core.Server';

    constructor(
        dependencyLocator: IDependencyLocator & IDependencyRegistry,
        queryableScopes: string[],
    ) {
        super(dependencyLocator, ServerManager.scope, queryableScopes);
    }
}
