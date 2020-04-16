import { ILayerManager } from './ILayerManager';
import { TypedIdentifier } from '../TypedIdentifier';
import {
    IDependencyRegistry,
    IDependencyLocator,
} from '../DependencyLocator';

export class LayerManager<T> implements ILayerManager<T> {

    private readonly modulesToInit: TypedIdentifier<any>[] = [];

    constructor(
        private readonly dependencyLocator: IDependencyLocator & IDependencyRegistry,
        private readonly scope: string,
        private readonly queryableScopes: string[],
    ) { }

    initModules(): void {
        for (let moduleIdentifier of this.modulesToInit) {
            const module = this.dependencyLocator.locate(moduleIdentifier);
            this.onModuleInit(module);
        }
    }

    registerModule<J extends T>(
        create: (locate: <K>(identifier: TypedIdentifier<K>) => K) => J,
        ...identifiers: TypedIdentifier<J>[]
    ): void {
        if (identifiers.length === 0) {
            throw new Error('Modules must have at least one identifier');
        }

        this.modulesToInit.push(identifiers[0]);
        this.dependencyLocator.registerDependency({
            scope: this.scope,
            queryableScopes: this.queryableScopes,
            identifiers,
            create,
        });
    }

    protected getDependencyLocator(): IDependencyLocator {
        return this.dependencyLocator;
    }

    protected onModuleInit(module: T): void {
        // Override to hook in
    }
}
