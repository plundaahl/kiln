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
        type: 'service',
        name: 'TestSystemModule',
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
        type: 'service',
        name: 'TestSystemModule',
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
