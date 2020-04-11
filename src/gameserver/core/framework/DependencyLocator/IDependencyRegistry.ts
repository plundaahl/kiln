import { TypedIdentifier } from '../TypedIdentifier';

export interface IDependencyRegistry {
    registerDependency<T>(params: {
        scope: string,
        queryableScopes: string[],
        identifiers: TypedIdentifier<T>[],
        create: (locate: <J>(identifier: TypedIdentifier<J>) => J) => T,
    }): void;
}
