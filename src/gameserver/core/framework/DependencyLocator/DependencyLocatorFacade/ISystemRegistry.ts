import { TypedIdentifier } from '../TypedIdentifier';
import { ISystemLocator } from './ISystemLocator';

export interface ISystemRegistry {

    registerSystemFactory<T>(
        factoryFn: (dependencyLocator: ISystemLocator) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void;
}
