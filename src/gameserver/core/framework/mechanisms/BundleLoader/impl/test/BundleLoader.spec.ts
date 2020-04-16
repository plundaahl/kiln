import {
    BundleLoader,
    ModuleLoader,
    IModule,
    IModuleLoaderStrategy,
} from '../..'

test(
    `GIVEN I register several ModuleLoaderStrategies, ` +
    `WHEN I try to load a bundle containing modules of all of those types, ` +
    `THEN BundleLoader should call #load() on each of those strategies without error.`,
    () => {
        interface FooModule extends IModule<'foo'> { getType(): 'foo' };
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => "foo",
            load: jest.fn(),
        }

        interface BarModule extends IModule<'bar'> { getType(): 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar'> = {
            getType: () => "bar",
            load: jest.fn(),
        }

        interface BazModule extends IModule<'baz'> { getType(): 'baz' };
        const bazModuleLoaderStrategy: IModuleLoaderStrategy<'baz'> = {
            getType: () => "baz",
            load: jest.fn(),
        }

        const loader = new BundleLoader(
            new ModuleLoader,
            fooModuleLoaderStrategy,
            barModuleLoaderStrategy,
            bazModuleLoaderStrategy,
        );

        loader.loadBundles({
            getName: () => 'TestBundle',
            getModules: () => [
                { getType: () => 'foo', getName: () => 'FooModule', getBundle: () => 'foo' },
                { getType: () => 'bar', getName: () => 'BarModule', getBundle: () => 'bar' },
                { getType: () => 'baz', getName: () => 'BazModule', getBundle: () => 'baz' },
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
        interface FooModule extends IModule<'foo'> { getType(): 'foo' };
        const fooModuleLoaderStrategyA: IModuleLoaderStrategy<'foo'> = {
            getType: () => "foo",
            load: jest.fn(),
        }

        const fooModuleLoaderStrategyB: IModuleLoaderStrategy<'foo'> = {
            getType: () => "foo",
            load: jest.fn(),
        }

        expect(() => new BundleLoader(
            new ModuleLoader,
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
        interface BarModule extends IModule<'bar'> { getType(): 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar'> = {
            getType: () => "bar",
            load: jest.fn(),
        }

        const bundle = {
            getName: () => 'TestBundle',
            getModules: () => [
                { getType: () => 'foo', getName: () => 'FooModule' },
            ]
        }

        const loader = new BundleLoader(
            new ModuleLoader,
            barModuleLoaderStrategy,
        );
        expect(() => loader.loadBundles(bundle)).toThrow();
    });

test(
    `GIVEN a Bundle with several modules, ` +
    `AND a BundleLoader with matching ModuleLoaderStrategies, ` +
    `WHEN I pass that bundle into BundleLoader.loadBundle, ` +
    `THEN BundleLoader should pass the correct modules into the correct ModuleLoaderStrategies.`,
    () => {
        interface FooModule extends IModule<'foo'> { getType(): 'foo' };
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => "foo",
            load: jest.fn(),
        }

        interface BarModule extends IModule<'bar'> { getType(): 'bar' };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar'> = {
            getType: () => "bar",
            load: jest.fn(),
        }

        interface BazModule extends IModule<'baz'> { getType(): 'baz' };
        const bazModuleLoaderStrategy: IModuleLoaderStrategy<'baz'> = {
            getType: () => "baz",
            load: jest.fn(),
        }

        const loader = new BundleLoader(
            new ModuleLoader,
            fooModuleLoaderStrategy,
            barModuleLoaderStrategy,
            bazModuleLoaderStrategy,
        );

        const fooModule1 = { getType: () => 'foo', getName: () => 'FooModule1' };
        const fooModule2 = { getType: () => 'foo', getName: () => 'FooModule2' };
        const barModule1 = { getType: () => 'bar', getName: () => 'BarModule1' };
        const bazModule1 = { getType: () => 'baz', getName: () => 'BazModule1' };
        const bazModule2 = { getType: () => 'baz', getName: () => 'BazModule2' };

        loader.loadBundles({
            getName: () => 'TestBundle',
            getModules: () => [
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
