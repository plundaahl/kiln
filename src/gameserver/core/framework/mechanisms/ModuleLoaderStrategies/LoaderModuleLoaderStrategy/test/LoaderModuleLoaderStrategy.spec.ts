import {
    IDependencyLocator,
    IDependencyRegistry,
} from '../../../DependencyLocator';
import {
    LoaderModuleLoaderStrategy,
    ILoaderModule,
} from '..';
import { IModuleLoaderRegistry, IModuleLoaderStrategy } from '../../../BundleLoader';

test(`Should error if passed module of wrong type`, () => {
    const registry: IModuleLoaderRegistry = {
        registerModuleLoaderStrategy: jest.fn()
    };
    const locator: IDependencyRegistry & IDependencyLocator = {
        locate: jest.fn(),
        registerDependency: jest.fn(),
    }
    const loaderModuleLoaderStrategy = new LoaderModuleLoaderStrategy(
        registry,
        locator,
    );
    const testModuleLoaderStrategy: IModuleLoaderStrategy<'foo.loader'> = {
        getType: () => 'foo.loader',
        load: () => { },
    }

    expect(() => loaderModuleLoaderStrategy.load(
        {
            getType: () => 'wrongModuleType',
            getName: () => 'testModule',
            createLoader: () => testModuleLoaderStrategy,
        } as unknown as ILoaderModule)
    ).toThrowError();
});

test(`Should error if passed module with no #createLoader function`, () => {
    const registry: IModuleLoaderRegistry = {
        registerModuleLoaderStrategy: jest.fn()
    };
    const locator: IDependencyRegistry & IDependencyLocator = {
        locate: jest.fn(),
        registerDependency: jest.fn(),
    }
    const loaderModuleLoaderStrategy = new LoaderModuleLoaderStrategy(
        registry,
        locator,
    );

    expect(() => loaderModuleLoaderStrategy.load(
        {
            getType: () => LoaderModuleLoaderStrategy.typeName,
            getName: () => 'testModule',
        } as unknown as ILoaderModule)
    ).toThrowError();
});

test(`Should pass locator into module.createLoader`, () => {
    const registry: IModuleLoaderRegistry = {
        registerModuleLoaderStrategy: jest.fn()
    };
    const locator: IDependencyRegistry & IDependencyLocator = {
        locate: jest.fn(),
        registerDependency: jest.fn(),
    }
    const loaderModuleLoaderStrategy = new LoaderModuleLoaderStrategy(
        registry,
        locator,
    );
    const testModuleLoaderStrategy: IModuleLoaderStrategy<typeof LoaderModuleLoaderStrategy.typeName> = {
        getType: () => LoaderModuleLoaderStrategy.typeName,
        load: () => { },
    }

    const createLoaderSpy = jest.fn()
    loaderModuleLoaderStrategy.load({
        getType: () => LoaderModuleLoaderStrategy.typeName,
        getName: () => 'testModule',
        createLoader: (locator) => {
            createLoaderSpy(locator);
            return testModuleLoaderStrategy;
        },
    } as ILoaderModule);

    expect(createLoaderSpy).toHaveBeenCalledWith(locator);
});

test(`Should register result of module.createLoader with registry`, () => {
    const registry: IModuleLoaderRegistry = {
        registerModuleLoaderStrategy: jest.fn()
    };
    const locator: IDependencyRegistry & IDependencyLocator = {
        locate: jest.fn(),
        registerDependency: jest.fn(),
    }
    const loaderModuleLoaderStrategy = new LoaderModuleLoaderStrategy(
        registry,
        locator,
    );
    const testModuleLoaderStrategy: IModuleLoaderStrategy<typeof LoaderModuleLoaderStrategy.typeName> = {
        getType: () => LoaderModuleLoaderStrategy.typeName,
        load: () => { },
    }

    const createLoaderSpy = jest.fn()
    loaderModuleLoaderStrategy.load({
        getType: () => LoaderModuleLoaderStrategy.typeName,
        getName: () => 'testModule',
        createLoader: (locator) => {
            createLoaderSpy(locator);
            return testModuleLoaderStrategy;
        },
    } as ILoaderModule);

    expect(registry.registerModuleLoaderStrategy).toHaveBeenCalledWith(testModuleLoaderStrategy);
});

test(`#getType should return correct type`, () => {
    const registry: IModuleLoaderRegistry = {
        registerModuleLoaderStrategy: jest.fn()
    };
    const locator: IDependencyRegistry & IDependencyLocator = {
        locate: jest.fn(),
        registerDependency: jest.fn(),
    }
    const loaderModuleLoaderStrategy = new LoaderModuleLoaderStrategy(
        registry,
        locator,
    );

    expect(loaderModuleLoaderStrategy.getType()).toBe(LoaderModuleLoaderStrategy.typeName);
});
