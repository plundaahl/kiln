import { TypedIdentifier } from '../TypedIdentifier';
import { ISystemLocator } from './ISystemLocator';

export interface IServiceRegistry {

    registerServiceFactory<T>(
        factoryFn: (dependencyLocator: ISystemLocator) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void;
}
