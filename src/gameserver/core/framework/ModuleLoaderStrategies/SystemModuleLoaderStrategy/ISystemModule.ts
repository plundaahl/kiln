import { IModule } from '../../BundleLoader/IModule';
import {
    ISystemLocator,
    TypedIdentifier,
} from '../../DependencyLocator';

export interface ISystemModule<T> extends IModule<'system'> {
    getType(): 'system',
    getName(): string,
    factory(locator: ISystemLocator): T,
    identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]],
}
