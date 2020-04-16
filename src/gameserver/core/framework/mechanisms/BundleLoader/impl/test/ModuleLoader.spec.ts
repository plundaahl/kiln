import { IModuleLoaderStrategy } from '../../IModuleLoaderStrategy';
import { ModuleLoader } from '../ModuleLoader';
import { IModule } from '../../IModule';

describe(`registerModuleLoaderStrategy`, () => {
    test(`When registering second strategy with same type, should error`, () => {
        const loader = new ModuleLoader();
        loader.registerModuleLoaderStrategy({
            getType: () => 'foo',
            load: jest.fn(),
        });

        expect(() => {
            loader.registerModuleLoaderStrategy({
                getType: () => 'foo',
                load: jest.fn(),
            });
        }).toThrowError();
    });

    test(`Once registered, a loader should be used to load all modules of its type`, () => {
        const loader = new ModuleLoader();
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => 'foo',
            load: jest.fn(),
        };
        const fooModule1: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };
        const fooModule2: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule2',
        };

        loader.registerModuleLoaderStrategy(fooModuleLoaderStrategy);
        loader.loadModules(fooModule1, fooModule2);

        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule1);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule2);
    });
});

describe(`ModuleLoader`, () => {
    test(`If no matching ModuleLoaderStrategy is registered, should error`, () => {
        const loader = new ModuleLoader();
        const fooModule: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };
        expect(() => loader.loadModules(fooModule)).toThrowError();
    });

    test(`If same module is loaded twice, should error`, () => {
        const loader = new ModuleLoader();
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => 'foo',
            load: jest.fn(),
        };
        const fooModule: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };

        loader.registerModuleLoaderStrategy(fooModuleLoaderStrategy);
        expect(() => loader.loadModules(fooModule)).not.toThrowError();
        expect(() => loader.loadModules(fooModule)).toThrowError();
    });

    test(`Module should be passed into matching ModuleLoaderStrategy`, () => {
        const loader = new ModuleLoader();
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => 'foo',
            load: jest.fn(),
        };
        const fooModule: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };

        loader.registerModuleLoaderStrategy(fooModuleLoaderStrategy);
        loader.loadModules(fooModule);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule);
    });

    test(`Module should NOT be passed into any non-matching ModuleLoaderStrategies`, () => {
        const loader = new ModuleLoader();
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => 'foo',
            load: jest.fn(),
        };
        const barModuleLoaderStrategy: IModuleLoaderStrategy<'bar'> = {
            getType: () => 'bar',
            load: jest.fn(),
        };
        const fooModule: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };

        loader.registerModuleLoaderStrategy(fooModuleLoaderStrategy);
        loader.registerModuleLoaderStrategy(barModuleLoaderStrategy);
        loader.loadModules(fooModule);

        expect(barModuleLoaderStrategy.load).not.toHaveBeenCalled();
    });

    test(`Modules should be loaded based on order in which ModuleLoaderStrategies were registered`, () => {
        const loader = new ModuleLoader();
        const callOrder: string[] = [];

        loader.registerModuleLoaderStrategy({
            getType: () => 'foo',
            load: () => callOrder.push('foo'),
        });
        loader.registerModuleLoaderStrategy({
            getType: () => 'bar',
            load: () => callOrder.push('bar'),
        });

        loader.loadModules(
            { getType: () => 'bar', getName: () => 'barModule1' },
            { getType: () => 'foo', getName: () => 'fooModule1' },
            { getType: () => 'bar', getName: () => 'barModule2' },
            { getType: () => 'foo', getName: () => 'fooModule2' },
            { getType: () => 'bar', getName: () => 'barModule3' },
        );

        expect(callOrder.toString()).toBe([
            'foo',
            'foo',
            'bar',
            'bar',
            'bar',
        ].toString());
    });

    test(`Registering a ModuleLoaderStrategy during module loading should work`, () => {
        const loader = new ModuleLoader();

        // A module that defines a new ModuleLoaderStrategy
        interface LoaderModule extends IModule<'loader'> {
            getStrategy: () => IModuleLoaderStrategy<string>,
        };
        const loadModuleLoaderStrategySpy = jest.fn();
        const loadModuleLoaderStrategy = (module: IModule<'loader'>) => {
            loadModuleLoaderStrategySpy(module);
            const strategyToLoad = (module as LoaderModule).getStrategy();
            loader.registerModuleLoaderStrategy(strategyToLoad);
        };
        const loaderModuleLoaderStrategy: IModuleLoaderStrategy<'loader'> = {
            getType: () => 'loader',
            load: loadModuleLoaderStrategy,
        }

        // FooModules, and the associated ModuleLoaderStrategy
        const fooModuleLoaderStrategy: IModuleLoaderStrategy<'foo'> = {
            getType: () => 'foo',
            load: jest.fn(),
        };
        const fooLoaderModule: LoaderModule = {
            getType: () => 'loader',
            getName: () => 'foo.loader',
            getStrategy: () => fooModuleLoaderStrategy,
        };
        const fooModule1: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule1',
        };
        const fooModule2: IModule<'foo'> = {
            getType: () => 'foo',
            getName: () => 'fooModule2',
        };

        loader.registerModuleLoaderStrategy(loaderModuleLoaderStrategy);
        loader.loadModules(
            fooModule1,
            fooLoaderModule,
            fooModule2,
        );

        expect(loadModuleLoaderStrategySpy).toHaveBeenCalledWith(fooLoaderModule);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule1);
        expect(fooModuleLoaderStrategy.load).toHaveBeenCalledWith(fooModule2);
    });
});
