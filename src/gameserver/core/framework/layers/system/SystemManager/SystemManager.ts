import { ILayerManager, LayerManager } from '../../../mechanisms/LayerManager';
import { IDependencyLocator, IDependencyRegistry } from '../../../mechanisms/DependencyLocator';
import { TypedIdentifier } from '../../../mechanisms/TypedIdentifier';
import { IUpdatableSystem } from './IUpdatableSystem';
import { ISystem } from './ISystem';

export class SystemManager
    extends LayerManager<ISystem>
    implements ILayerManager<ISystem> {

    public static readonly scope = 'system';
    private updateables: IUpdatableSystem[] = [];

    constructor(
        dependencyLocator: IDependencyLocator & IDependencyRegistry,
        private readonly updateOrderIdentifiers: TypedIdentifier<IUpdatableSystem>[],
    ) {
        super(dependencyLocator, SystemManager.scope, [SystemManager.scope]);
    }

    getUpdatableSystems(): IUpdatableSystem[] {
        const locator = this.getDependencyLocator();
        this.updateables = this.updateOrderIdentifiers.map(locator.locate);
        return this.updateables;
    }
}
