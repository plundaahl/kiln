import { IService } from './IService';
import { LayerManager, ILayerManager } from '../../../mechanisms/LayerManager';
import { IDependencyLocator, IDependencyRegistry } from '../../../mechanisms/DependencyLocator';

export class ServiceManager
    extends LayerManager<IService>
    implements ILayerManager<IService> {

    public static readonly scope = 'core.Service';

    constructor(
        dependencyLocator: IDependencyLocator & IDependencyRegistry,
        queryableScopes: string[],
    ) {
        super(dependencyLocator, ServiceManager.scope, queryableScopes);
    }
}
