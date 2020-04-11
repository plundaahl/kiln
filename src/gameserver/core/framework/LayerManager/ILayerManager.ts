import { TypedIdentifier } from '../TypedIdentifier';

export interface ILayerManager {
    initModules(): void;

    registerModule<T>(
        create: (locate: <J>(identifier: TypedIdentifier<J>) => J) => T,
        ...identifiers: TypedIdentifier<T>[]
    ): void;
}
