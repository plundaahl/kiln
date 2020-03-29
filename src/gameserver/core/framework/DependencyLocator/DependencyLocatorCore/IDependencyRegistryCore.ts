import { TypedIdentifier } from '../TypedIdentifier';
import { IDependencyLocatorCore } from './IDependencyLocatorCore';

export interface IDependencyRegistryCore<J> {

    /**
     * Registers a factory function for a service. When this service is
     * constructed, the DependencyLocator will be injected into the factory
     * function, allowing the factory function to request dependencies from the
     * DependencyLocator.
     *
     * @param factoryFn An instance of the service to register.
     * @param identifiers One or more Identifiers that match the service's type.
     *
     * @throws If the identifier provided has already been registered.
     */
    registerFactory<T>(
        factoryFn: (dependencyLocator: J) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void;
}
