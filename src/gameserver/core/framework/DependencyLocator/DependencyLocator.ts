import { IDependencyLocator } from './IDependencyLocator';
import { IDependencyRegistry } from './IDependencyRegistry';
import { TypedIdentifier } from '../TypedIdentifier';

type DependencyEntry<T> = {
    instance?: T,
    create: (locate: <J>(identifier: TypedIdentifier<J>) => J) => T,
    scope: string,
    queryableScopes: string[],
}

type RequestEntry = {
    number: number,
    identifier: TypedIdentifier<any>,
};

export class DependencyLocator implements IDependencyLocator, IDependencyRegistry {

    private readonly idMap: Map<TypedIdentifier<any>, number> = new Map();
    private readonly dependencies: DependencyEntry<any>[] = [];
    private readonly requestStack: RequestEntry[] = [];

    locate<T>(identifier: TypedIdentifier<T>, inScopes?: string[]): T {
        const depNum = this.idMap.get(identifier);
        if (depNum === undefined) {
            throw new Error(this.createNoDependencyErrMsg(identifier));
        }

        const registryEntry = this.dependencies[depNum];
        if (inScopes && !inScopes.includes(registryEntry.scope)) {
            throw new Error(this.createInvalidScopeErrMsg(identifier, inScopes));
        }

        if (this.requestStack.find(entry => entry.number === depNum)) {
            throw new Error(this.createCircularDependencyErrMsg(identifier));
        }

        if (!registryEntry.instance) {
            this.requestStack.push({
                identifier,
                number: depNum,
            });

            const scopedLocateFn = this.getLocateFnForScopes(registryEntry.queryableScopes);
            registryEntry.instance = registryEntry.create(scopedLocateFn);

            this.requestStack.pop();
        }

        return registryEntry.instance;
    }

    registerDependency<T>(params: {
        scope: string,
        queryableScopes: string[],
        identifiers: TypedIdentifier<T>[],
        create: (locate: <J>(identifier: TypedIdentifier<J>) => J) => T,
    }): void {

        const { scope, queryableScopes, identifiers, create } = params;
        const dependencyNo = this.dependencies.length;

        for (let identifier of identifiers) {
            if (this.idMap.has(identifier)) {
                throw new Error(`Attempting to register a second dependency with identifier ${identifier}`);
            }
        }

        this.dependencies.push({
            create,
            scope,
            queryableScopes,
        });

        for (let identifier of identifiers) {
            this.idMap.set(identifier, dependencyNo);
        }
    }

    private getLocateFnForScopes(scopes: string[]) {
        return <T>(identifier: TypedIdentifier<T>): T => {
            return this.locate(identifier, scopes);
        }
    }

    private createNoDependencyErrMsg(identifier: TypedIdentifier<any>): string {
        return `No dependency registered for identifier ${identifier}.`;
    }

    private createInvalidScopeErrMsg(
        identifier: TypedIdentifier<any>,
        inScopes: string[],
    ): string {
        return `No dependency for ${identifier} registered `
            + `in any of the available scopes (${inScopes.join(', ')})`;
    }

    private createCircularDependencyErrMsg(identifier: TypedIdentifier<any>): string {
        return `Circular dependency detected:\n`
            + this.requestStack
                .map(entry => entry.identifier)
                .map((curIdentifier, index) => {
                    if (index === 0) {
                        return `  +--> ${curIdentifier} (aka ${identifier})`;
                    } else if (index < this.requestStack.length - 1) {
                        return `  |    ${curIdentifier}`;
                    } else {
                        return `  +--- ${curIdentifier}`
                    }
                })
                .join('\n');
    }
}
