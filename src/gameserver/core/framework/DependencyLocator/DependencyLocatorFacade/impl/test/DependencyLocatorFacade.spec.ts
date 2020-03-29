import {
    DependencyLocatorFacade,
    ISystemLocator,
    IServiceLocator,
} from '../..';
import { TypedIdentifier } from '../../../TypedIdentifier';

describe('System Registration & Location', () => {
    test(
        `GIVEN I register a factory with #registerSystemFactory, ` +
        `THEN I should be able to retrieve it from #locateSystem.`,
        () => {
            class FooSystem { foo(): String { return "foo"; } }
            type FooSystemFactory = () => FooSystem;
            const fooSystemId = new TypedIdentifier<FooSystem>('FooSystem');
            const fooSystemFactory: FooSystemFactory = () => new FooSystem();

            const locator = new DependencyLocatorFacade();
            locator.registerSystemFactory(fooSystemFactory, fooSystemId);
            const fooSystem = locator.locateSystem(fooSystemId);

            expect(fooSystem).not.toBe(undefined);
            expect(fooSystem).toBeInstanceOf(FooSystem);
            expect(fooSystem.foo()).toBe('foo');
        });

    test(
        `GIVEN I register a factory with #registerSystemFactory, ` +
        `THEN I should NOT be able to retrieve it from #locateService.`,
        () => {
            class FooSystem { foo(): String { return "foo"; } }
            type FooSystemFactory = () => FooSystem;
            const fooSystemId = new TypedIdentifier<FooSystem>('FooSystem');
            const fooSystemFactory: FooSystemFactory = () => new FooSystem();

            const locator = new DependencyLocatorFacade();
            locator.registerSystemFactory(fooSystemFactory, fooSystemId);

            expect(() => locator.locateService(fooSystemId)).toThrow();
        });

    test(
        `GIVEN I register a factory with #registerSystemFactory, ` +
        `AND I register a second factory with #registerSystemFactory, ` +
        `AND that second factory depends on the first, ` +
        `WHEN I attempt to locate the second factory,` +
        `THEN it should be able to locate the first from the locator API.`,
        () => {
            type FooSystem = { foo: () => string };
            type FooSystemFactory = () => FooSystem;
            const fooSystemId = new TypedIdentifier<FooSystem>('FooSystem');
            const fooSystemFactory: FooSystemFactory = () => {
                return { foo: () => "foo" };
            }

            let fooSystem: FooSystem | undefined;

            type BarSystem = { bar: () => string };
            type BarSystemFactory = (locator: ISystemLocator) => BarSystem;
            const barSystemId = new TypedIdentifier<BarSystem>('BarSystem');
            const barSystemFactory: BarSystemFactory = (locator: ISystemLocator) => {
                fooSystem = locator.locateSystem(fooSystemId);
                return {
                    bar: () => fooSystem ? fooSystem.foo() : 'bar'
                };
            }

            const locator = new DependencyLocatorFacade();
            locator.registerSystemFactory(fooSystemFactory, fooSystemId);
            locator.registerSystemFactory(barSystemFactory, barSystemId);
            const barSystem = locator.locateSystem(barSystemId);

            expect(fooSystem).not.toBe(undefined);
            expect(barSystem.bar()).toBe('foo');
        });
});

describe('Service Registration', () => {
    test(
        `GIVEN I register a factory with #registerSystemFactory, ` +
        `AND I register a second factory with #registerServiceFactory, ` +
        `AND that second factory depends on the first, ` +
        `WHEN I attempt to locate the second factory,` +
        `THEN it should be able to locate the first from the locator API.`,
        () => {
            type FooSystem = { foo: () => string };
            type FooSystemFactory = () => FooSystem;
            const fooSystemId = new TypedIdentifier<FooSystem>('FooSystem');
            const fooSystemFactory: FooSystemFactory = () => {
                return { foo: () => "foo" };
            }

            let fooSystem: FooSystem | undefined;

            type BarService = { bar: () => string };
            type BarServiceFactory = (locator: ISystemLocator) => BarService;
            const barServiceId = new TypedIdentifier<BarService>('BarService');
            const barServiceFactory: BarServiceFactory = (locator: ISystemLocator) => {
                fooSystem = locator.locateSystem(fooSystemId);
                return {
                    bar: () => fooSystem ? fooSystem.foo() : 'bar'
                };
            }

            const locator = new DependencyLocatorFacade();
            locator.registerSystemFactory(fooSystemFactory, fooSystemId);
            locator.registerServiceFactory(barServiceFactory, barServiceId);
            const barService = locator.locateService(barServiceId);

            expect(fooSystem).not.toBe(undefined);
            expect(barService.bar()).toBe('foo');
        });

    test(
        `GIVEN I register a factory with #registerServiceFactory, ` +
        `AND I register a second factory with #registerServiceFactory, ` +
        `AND that second factory depends on the first, ` +
        `WHEN I attempt to locate the second factory,` +
        `THEN it should NOT be able to locate the first from the locator API.`,
        () => {
            type FooService = { foo: () => string };
            type FooServiceFactory = () => FooService;
            const fooServiceId = new TypedIdentifier<FooService>('FooService');
            const fooServiceFactory: FooServiceFactory = () => {
                return { foo: () => "foo" };
            }

            let fooSystem: FooService | undefined;

            type BarService = { bar: () => string };
            type BarServiceFactory = (locator: ISystemLocator) => BarService;
            const barServiceId = new TypedIdentifier<BarService>('BarService');
            const barServiceFactory: BarServiceFactory = (locator: ISystemLocator) => {
                fooSystem = (locator as unknown as IServiceLocator).locateService(fooServiceId);
                return {
                    bar: () => fooSystem ? fooSystem.foo() : 'bar'
                };
            }

            const locator = new DependencyLocatorFacade();
            locator.registerServiceFactory(fooServiceFactory, fooServiceId);
            locator.registerServiceFactory(barServiceFactory, barServiceId);

            expect(() => locator.locateService(barServiceId)).toThrow();
        });
});

describe(`Service Location`, () => {
    test(
        `GIVEN I register a factory with #registerServiceFactory, ` +
        `THEN I should be able to retrieve it from #locateService.`,
        () => {
            class FooService { foo(): String { return "foo"; } }
            type FooServiceFactory = () => FooService;
            const fooServiceId = new TypedIdentifier<FooService>('FooService');
            const fooServiceFactory: FooServiceFactory = () => new FooService();

            const locator = new DependencyLocatorFacade();
            locator.registerServiceFactory(fooServiceFactory, fooServiceId);
            const fooSystem = locator.locateService(fooServiceId);

            expect(fooSystem).not.toBe(undefined);
            expect(fooSystem).toBeInstanceOf(FooService);
            expect(fooSystem.foo()).toBe('foo');
        });

    test(
        `GIVEN I register a factory with #registerSystemFactory, ` +
        `THEN I should NOT be able to retrieve it from #locateService.`,
        () => {
            class FooService { foo(): String { return "foo"; } }
            type FooServiceFactory = () => FooService;
            const fooServiceId = new TypedIdentifier<FooService>('FooService');
            const fooServiceFactory: FooServiceFactory = () => new FooService();

            const locator = new DependencyLocatorFacade();
            locator.registerServiceFactory(fooServiceFactory, fooServiceId);

            expect(() => locator.locateSystem(fooServiceId)).toThrow();
        });
})
