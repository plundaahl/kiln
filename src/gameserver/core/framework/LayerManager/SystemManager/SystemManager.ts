import { ILayerManager, LayerManager } from '..';
import { IDependencyLocator, IDependencyRegistry } from '../../DependencyLocator';
import { TypedIdentifier } from '../../TypedIdentifier';
import { IUpdatableSystem } from './IUpdatableSystem';

const scope = 'system';
const queryableScopes = [scope];

export class SystemManager extends LayerManager implements ILayerManager {

    private updateables: IUpdatableSystem[] = [];

    constructor(
        dependencyLocator: IDependencyLocator & IDependencyRegistry,
        private readonly updateOrderIdentifiers: TypedIdentifier<IUpdatableSystem>[],
    ) {
        super(dependencyLocator, scope, queryableScopes);
    }

    getUpdatableSystems(): IUpdatableSystem[] {
        const locator = this.getDependencyLocator();
        this.updateables = this.updateOrderIdentifiers.map(locator.locate);
        return this.updateables;
    }
}
