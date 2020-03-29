import { IDependencyLocatorFacade } from '../IDependencyLocatorFacade';
import { ISystemLocator } from '../ISystemLocator';
import {
    IDependencyLocatorCore,
    DependencyLocatorCore,
    IDependencyRegistryCore,
} from '../../DependencyLocatorCore';
import { TypedIdentifier } from '../../TypedIdentifier';

export class DependencyLocatorFacade implements IDependencyLocatorFacade {

    private readonly serviceLocator: IDependencyLocatorCore & IDependencyRegistryCore<ISystemLocator>;
    private readonly systemLocator: IDependencyLocatorCore & IDependencyRegistryCore<ISystemLocator>;

    constructor() {
        this.serviceLocator = new DependencyLocatorCore({
            locateSystem: this.locateSystem.bind(this)
        });

        this.systemLocator = new DependencyLocatorCore({
            locateSystem: this.locateSystem.bind(this)
        });
    }

    locateService<T>(identifier: TypedIdentifier<T>): T {
        return this.serviceLocator.locate(identifier);
    }

    locateSystem<T>(identifier: TypedIdentifier<T>): T {
        return this.systemLocator.locate(identifier);
    }

    registerServiceFactory<T>(
        factoryFn: (dependencyLocator: ISystemLocator) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void {
        this.serviceLocator.registerFactory(factoryFn, ...identifiers);
    }

    registerSystemFactory<T>(
        factoryFn: (dependencyLocator: ISystemLocator) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void {
        this.systemLocator.registerFactory(factoryFn, ...identifiers);
    }
}
