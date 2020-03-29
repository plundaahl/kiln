import { IModule } from '../../BundleLoader/IModule';
import {
    ISystemLocator,
    TypedIdentifier,
} from '../../DependencyLocator';

export interface IServiceModule<T> extends IModule<'service'> {
    type: 'service',
    name: String,
    factory: (locator: ISystemLocator) => T,
    identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]],
}
