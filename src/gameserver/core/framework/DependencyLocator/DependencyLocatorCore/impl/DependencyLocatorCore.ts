import { IDependencyLocatorCore } from '../IDependencyLocatorCore';
import { IDependencyRegistryCore } from '../IDependencyRegistryCore';
import { TypedIdentifier } from '../../TypedIdentifier/TypedIdentifier';

type DependencyEntry<L, T> = {
    factoryFn: (locator: L) => T,
    instance?: T,
    underConstruction?: boolean,
}

export class DependencyLocatorCore<L> implements IDependencyLocatorCore, IDependencyRegistryCore<L> {

    private readonly dependencyEntries: DependencyEntry<L, any>[] = [];
    private readonly dependencyLookup: Map<TypedIdentifier<any>, number> = new Map();
    private readonly dependencyStack: TypedIdentifier<any>[] = [];

    constructor(private readonly injectable: L) { }


    registerFactory<T>(
        factoryFn: (dependencyLocator: L) => T,
        ...identifiers: [TypedIdentifier<Partial<T>>, ...TypedIdentifier<Partial<T>>[]]
    ): void {
        for (let identifier of identifiers) {
            if (this.dependencyLookup.has(identifier)) {
                throw new Error(`A dependency has already been registered to identifier ${identifier.toString()}.`);
            }
        }

        const serviceNumber = this.dependencyEntries.length;
        this.dependencyEntries.push({ factoryFn });

        for (let identifier of identifiers) {
            this.dependencyLookup.set(identifier, serviceNumber);
        }
    }


    locate<T>(identifier: TypedIdentifier<T>): T {
        const serviceNumber = this.dependencyLookup.get(identifier);
        if (serviceNumber === undefined) {
            throw new Error(`No dependency registered for identifier ${identifier.toString}`);
        }

        this.dependencyStack.push(identifier);

        const dependencyEntry = this.dependencyEntries[serviceNumber];
        if (dependencyEntry.underConstruction) {
            throw new Error(
                `Circular dependency detected:\n` +
                this.dependencyStack
                    .map((dependency, index) => `  ${index + 1}: ${dependency.toString()}\n`)
                    .join('')
            );
        }

        if (!dependencyEntry.instance) {
            dependencyEntry.underConstruction = true;
            dependencyEntry.instance = dependencyEntry.factoryFn(this.injectable);
            dependencyEntry.underConstruction = false;
        }

        this.dependencyStack.pop();
        return dependencyEntry.instance;
    }
}
