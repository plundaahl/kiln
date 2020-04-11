import { TypedIdentifier } from '../../TypedIdentifier';
import { IModule } from '../../BundleLoader/IModule';

export interface ILayerElementModule<T extends string, D> extends IModule<T> {
    getType(): T,
    getName(): string,
    create(locate: <J>(identifier: TypedIdentifier<J>) => J): T,
    identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]],
}
