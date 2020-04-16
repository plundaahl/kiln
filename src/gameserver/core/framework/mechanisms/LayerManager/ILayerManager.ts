import { TypedIdentifier } from '../TypedIdentifier';

export interface ILayerManager<T> {
    initModules(): void;

    registerModule<J extends T>(
        create: (locate: <K>(identifier: TypedIdentifier<K>) => K) => J,
        ...identifiers: TypedIdentifier<J>[]
    ): void;
}
