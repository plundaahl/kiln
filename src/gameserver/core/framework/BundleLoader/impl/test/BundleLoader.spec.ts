import {
    BundleLoader,
    IModule,
    IModuleLoaderStrategy,
} from '../..'

test(
    `GIVEN I register several ModuleLoaderStrategies, ` +
    `WHEN I try to load a bundle containing modules of all of those types, ` +
    `THEN BundleLoader should call #load() on each of those strategies without error.`,
    () => {
        interface FooModule extends IModule<'foo'> { type: 'foo' };
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo', FooModule> = {
            type: "foo",
            load: jest.fn(),
        }

        interface BarModule extends IModule<'bar'> { type: 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar', BarModule> = {
            type: "bar",
            load: jest.fn(),
        }

        interface BazModule extends IModule<'baz'> { type: 'baz' };
        const bazModuleLoaderStrategy: IModuleLoaderStrategy<'baz', BazModule> = {
            type: "baz",
            load: jest.fn(),
        }

        const loader = new BundleLoader(
            fooModuleLoaderStrategy,
            barModuleLoaderStrategy,
            bazModuleLoaderStrategy,
        );

        loader.loadBundle({
            name: 'TestBundle',
            modules: [
                { type: 'foo', name: 'FooModule' },
                { type: 'bar', name: 'BarModule' },
                { type: 'baz', name: 'BazModule' },
            ]
        });

        expect(fooModuleLoaderStrategy.load).toHaveBeenCalled();
        expect(barModuleLoaderStrategy.load).toHaveBeenCalled();
        expect(bazModuleLoaderStrategy.load).toHaveBeenCalled();
    });

test(
    `WHEN I create a BundleLoader, ` +
    `AND I pass in two or more ModuleLoaderStrategies with the same type, ` +
    `THEN BundleLoader should error.`,
    () => {
        interface FooModule extends IModule<'foo'> { type: 'foo' };
        const fooModuleLoaderStrategyA: IModuleLoaderStrategy<'foo', FooModule> = {
            type: "foo",
            load: jest.fn(),
        }

        const fooModuleLoaderStrategyB: IModuleLoaderStrategy<'foo', FooModule> = {
            type: "foo",
            load: jest.fn(),
        }

        expect(() => new BundleLoader(
            fooModuleLoaderStrategyA,
            fooModuleLoaderStrategyB,
        )).toThrow();
    });

test(
    `GIVEN a bundle containing a module of some type, ` +
    `AND a BundleLoader that does NOT contain a ModuleLoaderStrategy matching that type, ` +
    `WHEN I attempt to load the bundle, ` +
    `THEN BundleLoader #loadBundle() should error.`,
    () => {
        interface BarModule extends IModule<'bar'> { type: 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar', BarModule> = {
            type: "bar",
            load: jest.fn(),
        }

        const bundle = {
            name: 'TestBundle',
            modules: [
                { type: 'foo', name: 'FooModule' },
            ]
        }

        const loader = new BundleLoader(barModuleLoaderStrategy);
        expect(() => loader.loadBundle(bundle)).toThrow();
    });

test(
    `GIVEN a Bundle with several modules, ` +
    `AND a BundleLoader with matching ModuleLoaderStrategies, ` +
    `WHEN I pass that bundle into BundleLoader.loadBundle, ` +
    `THEN BundleLoader should pass the correct modules into the correct ModuleLoaderStrategies.`,
    () => {
        interface FooModule extends IModule<'foo'> { type: 'foo' };
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo', FooModule> = {
            type: "foo",
            load: jest.fn(),
        }

        interface BarModule extends IModule<'bar'> { type: 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar', BarModule> = {
            type: "bar",
            load: jest.fn(),
        }

        interface BazModule extends IModule<'baz'> { type: 'baz' };
        const bazModuleLoaderStrategy: IModuleLoaderStrategy<'baz', BazModule> = {
            type: "baz",
            load: jest.fn(),
        }

        const loader = new BundleLoader(
            fooModuleLoaderStrategy,
            barModuleLoaderStrategy,
            bazModuleLoaderStrategy,
        );

        const fooModule1 = { type: 'foo', name: 'FooModule1' };
        const fooModule2 = { type: 'foo', name: 'FooModule2' };
        const barModule1 = { type: 'bar', name: 'BarModule1' };
        const bazModule1 = { type: 'baz', name: 'BazModule1' };
        const bazModule2 = { type: 'baz', name: 'BazModule2' };

        loader.loadBundle({
            name: 'TestBundle',
            modules: [
                barModule1,
                bazModule2,
                fooModule2,
                bazModule1,
                fooModule1,
            ]
        });

        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule1);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule2);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledTimes(2);

        expect(barModuleLoaderStrategy.load).toHaveBeenCalledWith(barModule1);
        expect(barModuleLoaderStrategy.load).toHaveBeenCalledTimes(1);

        expect(bazModuleLoaderStrategy.load).toHaveBeenCalledWith(bazModule1);
        expect(bazModuleLoaderStrategy.load).toHaveBeenCalledWith(bazModule2);
        expect(bazModuleLoaderStrategy.load).toHaveBeenCalledTimes(2);
    });
