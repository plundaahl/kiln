import { ILayerManager } from './ILayerManager';
import { TypedIdentifier } from '../TypedIdentifier';
import {
    IDependencyRegistry,
    IDependencyLocator,
} from '../DependencyLocator';

export class LayerManager implements ILayerManager {

    private readonly modulesToInit: TypedIdentifier<any>[] = [];

    constructor(
        private readonly dependencyLocator: IDependencyLocator & IDependencyRegistry,
        private readonly scope: string,
        private readonly queryableScopes: string[],
    ) { }

    initModules(): void {
        for (let moduleIdentifier of this.modulesToInit) {
            this.dependencyLocator.locate(moduleIdentifier);
        }
    }

    registerModule<T>(
        create: (locate: <J>(identifier: TypedIdentifier<J>) => J) => T,
        ...identifiers: TypedIdentifier<T>[]
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

}
