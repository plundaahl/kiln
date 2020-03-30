import { IModule } from '../../BundleLoader/IModule';
import {
    ISystemLocator,
    TypedIdentifier,
} from '../../DependencyLocator';

export interface ISystemModule<T> extends IModule<'system'> {
    type: 'system',
    name: string,
    factory: (locator: ISystemLocator) => T,
    identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]],
}
