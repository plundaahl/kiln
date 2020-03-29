import { IDependencyLocatorCore } from '../..';
import { TypedIdentifier } from '../../../TypedIdentifier';
import { DependencyLocatorCore } from '../DependencyLocatorCore';

describe(`registerFactory`, () => {
    test(
        `GIVEN I have registered a service using an identifier, ` +
        `WHEN I attempt to register another service with the same identifier, ` +
        `THEN DependencyLocator should error.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type IDummyService = { foo: "foo" };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");

            const factoryFn = () => { return { foo: "foo" }; };

            locator.registerFactory(factoryFn, identifierA);
            expect(() => {
                locator.registerFactory(factoryFn, identifierA);
            }).toThrow();
        });

    test(
        `GIVEN I register a dependency with the DependencyLocator, ` +
        `AND I have not yet attempted to locate it, ` +
        `THEN the factory function should not have been called.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type IDummyService = { id: number };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");

            let nInstancesCreated = 0;
            const factoryFnSpy = jest.fn();
            const factoryFn = () => {
                factoryFnSpy();
                return { id: nInstancesCreated++ };
            };

            locator.registerFactory(factoryFn, identifierA);
            expect(factoryFnSpy).toHaveBeenCalledTimes(0);
        });
});

describe(`locate`, () => {
    test(
        `GIVEN I register a service with multiple identifiers, ` +
        `WHEN I call #locate() with each identifier, ` +
        `THEN I should get back the same instance`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type IDummyService = { id: number };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");
            const identifierB = new TypedIdentifier<IDummyService>("IdentifierA");
            const identifierC = new TypedIdentifier<IDummyService>("IdentifierA");

            let nInstancesCreated = 0;
            const factoryFn = () => { return { id: nInstancesCreated++ }; };

            locator.registerFactory(factoryFn, identifierA, identifierB, identifierC);

            expect(locator.locate(identifierA).id).toBe(0);
            expect(locator.locate(identifierB).id).toBe(0);
            expect(locator.locate(identifierC).id).toBe(0);
        });

    test(
        `GIVEN I create a new DependencyLocator with an locator wrapper ` +
        `AND I register a factory function with that DependencyLocator, ` +
        `WHEN I attempt to locate that dependency, ` +
        `THEN the locator wrapper should be passed into the factory function`,
        () => {
            type LocatorApi = {
                id: 12345,
                locate: <T>(identifier: TypedIdentifier<T>) => T,
            }

            const locatorApiInstance: LocatorApi = {
                id: 12345,
                locate: (identifier) => locator.locate(identifier),
            };

            let locator: DependencyLocatorCore<LocatorApi> = new DependencyLocatorCore(locatorApiInstance);

            type IDummyService = { foo: () => "bar" };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");

            let locatorApiPassedIn: any;
            const factoryFn = (locator: LocatorApi) => {
                locatorApiPassedIn = locator;
                return {
                    foo: () => "bar"
                };
            };

            locator.registerFactory(factoryFn, identifierA);
            locator.locate(identifierA);

            expect(locatorApiPassedIn).toBe(locatorApiInstance);
        });


    test(
        `GIVEN I register a dependency with the DependencyLocator, ` +
        `WHEN I attempt to locate the same dependency multiple times, ` +
        `THEN the factory function is only called the first time.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type IDummyService = { id: number };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");

            let nInstancesCreated = 0;
            const factoryFnSpy = jest.fn();
            const factoryFn = () => {
                factoryFnSpy();
                return { id: nInstancesCreated++ };
            };

            locator.registerFactory(factoryFn, identifierA);

            locator.locate(identifierA);
            expect(factoryFnSpy).toHaveBeenCalledTimes(1)

            locator.locate(identifierA);
            locator.locate(identifierA);
            locator.locate(identifierA);
            expect(factoryFnSpy).toHaveBeenCalledTimes(1)
        });

    test(
        `WHEN I attempt to locate a dependency using an unregistred identifier, ` +
        `THEN the DependencyLocator throws an error.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type IDummyService = { id: number };
            const identifierA = new TypedIdentifier<IDummyService>("IdentifierA");

            expect(() => {
                locator.locate(identifierA);
            }).toThrow();
        });

    test(
        `GIVEN I register two dependencies that depend on each other, ` +
        `WHEN I attempt to locate one of the dependencies, ` +
        `THEN the DependencyLocator throws an error.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type FooService = { foo: string };
            type BarService = { bar: string };

            const fooIdentifier = new TypedIdentifier<FooService>("FooService");
            const barIdentifier = new TypedIdentifier<BarService>("BarService");

            locator.registerFactory(
                (locator: IDependencyLocatorCore) => {
                    locator.locate(barIdentifier);
                    return { foo: "foo" };
                },
                fooIdentifier
            );

            locator.registerFactory(
                (locator: IDependencyLocatorCore) => {
                    locator.locate(fooIdentifier);
                    return { bar: "bar" };
                },
                barIdentifier
            );

            expect(() => locator.locate(fooIdentifier)).toThrow();
        });

    test(
        `GIVEN I register multiple dependencies that depend on each other in a circle, ` +
        `WHEN I attempt to locate one of the dependencies, ` +
        `THEN the DependencyLocator throws an error, ` +
        `AND the Error describes the circular dependency graph.`,
        () => {
            let locator: DependencyLocatorCore<IDependencyLocatorCore> = new DependencyLocatorCore({
                locate: (identifier) => locator.locate(identifier),
            });

            type FooService = { foo: string };
            type BarService = { bar: string };
            type BazService = { baz: string };

            const fooIdentifier = new TypedIdentifier<FooService>("FooService");
            const barIdentifier = new TypedIdentifier<BarService>("BarService");
            const bazIdentifier = new TypedIdentifier<BazService>("BazService");

            type FooFactory = (locator: IDependencyLocatorCore) => FooService;
            const fooFactory: FooFactory = (locator) => {
                locator.locate(barIdentifier);
                return { foo: "foo" };
            };


            type BarFactory = (locator: IDependencyLocatorCore) => BarService;
            const barFactory: BarFactory = (locator: IDependencyLocatorCore) => {
                locator.locate(bazIdentifier);
                return { bar: "bar" };
            };

            type BazFactory = (locator: IDependencyLocatorCore) => BazService;
            const bazFactory: BazFactory = (locator: IDependencyLocatorCore) => {
                locator.locate(fooIdentifier);
                return { baz: "baz" };
            };

            locator.registerFactory(fooFactory, fooIdentifier);
            locator.registerFactory(barFactory, barIdentifier);
            locator.registerFactory(bazFactory, bazIdentifier);

            let error: Error | undefined;
            try {
                locator.locate(fooIdentifier);
            } catch (err) {
                error = err;
            }

            expect(error).not.toBeUndefined;
            expect((error as Error).message).toBe(
                `Circular dependency detected:\n` +
                `  1: FooService\n` +
                `  2: BarService\n` +
                `  3: BazService\n` +
                `  4: FooService\n`
            );
        });
})
