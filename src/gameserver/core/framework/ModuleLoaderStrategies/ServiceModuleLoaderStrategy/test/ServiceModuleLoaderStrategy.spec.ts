import {
    IServiceRegistry,
    TypedIdentifier,
} from '../../../DependencyLocator';
import {
    IServiceModule,
    ServiceModuleLoaderStrategy,
} from '..';

test(`Should pass register the module's factory, plus all identifiers, with the DependencyLocator`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module: IServiceModule<TestSystem> = {
        getType: () => 'service',
        getName: () => 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [
            identifierA,
            identifierB
        ]
    };

    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, () => { });

    strategy.load(module);

    expect(locator.registerServiceFactory).toHaveBeenCalledTimes(1);
    expect(locator.registerServiceFactory).toHaveBeenCalledWith(
        module.factory,
        ...module.identifiers,
    );
});

test(`Should error if module type is not actually "system"`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module = {
        type: 'not-a-valid-system-module',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [
            identifierA,
            identifierB
        ]
    };

    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as IServiceModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module does not have a #factory property`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module = {
        type: 'service',
        name: 'TestSystemModule',
        identifiers: [
            identifierA,
            identifierB
        ]
    };

    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as IServiceModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module does not have an #identifiers property`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module = {
        type: 'service',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
    };

    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as IServiceModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module has 0 identifiers`, () => {
    type TestSystem = { foo: 'foo' };

    const module = {
        type: 'service',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [],
    };

    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as IServiceModule<TestSystem>);
    }).toThrow();
});

test(`When #load() is called, should pass first identifier into #onServiceRegistered`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');

    const module: IServiceModule<TestSystem> = {
        getType: () => 'service',
        getName: () => 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [
            identifierA,
        ],
    };

    const onServiceRegistered = jest.fn();
    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, onServiceRegistered);

    strategy.load(module);

    expect(onServiceRegistered).toHaveBeenCalledTimes(1);
    expect(onServiceRegistered).toHaveBeenCalledWith(identifierA);
});

test(`#load() should error if passed module if incorrect type`, () => {
    type TestSystem = { foo: 'foo' };
    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');

    const onServiceRegistered = jest.fn();
    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, onServiceRegistered);

    expect(() => strategy.load(
        {
            getType: () => 'wrongType',
            getName: () => 'TestSystemModule',
            factory: () => { return { foo: 'foo' } },
            identifiers: [
                identifierA,
            ],
        } as unknown as IServiceModule<TestSystem>)
    ).toThrow();
});

test(`#load() should error if passed module with no #factory function`, () => {
    type TestSystem = { foo: 'foo' };
    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');

    const onServiceRegistered = jest.fn();
    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, onServiceRegistered);

    expect(() => strategy.load(
        {
            getType: () => 'service',
            getName: () => 'TestSystemModule',
            identifiers: [
                identifierA,
            ],
        } as unknown as IServiceModule<TestSystem>)
    ).toThrow();
});

test(`#load() should error if passed module with no identifiers property`, () => {
    type TestSystem = { foo: 'foo' };

    const onServiceRegistered = jest.fn();
    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, onServiceRegistered);

    expect(() => strategy.load(
        {
            getType: () => 'service',
            getName: () => 'TestSystemModule',
            factory: () => { return { foo: 'foo' } },
        } as unknown as IServiceModule<TestSystem>)
    ).toThrow();
});

test(`#load() should error if passed module less than one identifier`, () => {
    type TestSystem = { foo: 'foo' };
    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');

    const onServiceRegistered = jest.fn();
    const locator: IServiceRegistry = { registerServiceFactory: jest.fn() };
    const strategy = new ServiceModuleLoaderStrategy(locator, onServiceRegistered);

    expect(() => strategy.load(
        {
            getType: () => 'service',
            getName: () => 'TestSystemModule',
            factory: () => { return { foo: 'foo' } },
            identifiers: [],
        } as unknown as IServiceModule<TestSystem>)
    ).toThrow();
});
