import {
    ISystemRegistry,
    TypedIdentifier,
} from '../../../DependencyLocator';
import {
    ISystemModule,
    SystemModuleLoaderStrategy,
} from '..';

test(`Should pass register the module's factory, plus all identifiers, with the DependencyLocator`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module: ISystemModule<TestSystem> = {
        type: 'system',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [
            identifierA,
            identifierB
        ]
    };

    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, () => { });

    strategy.load(module);

    expect(locator.registerSystemFactory).toHaveBeenCalledTimes(1);
    expect(locator.registerSystemFactory).toHaveBeenCalledWith(
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

    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as ISystemModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module does not have a #factory property`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module = {
        type: 'system',
        name: 'TestSystemModule',
        identifiers: [
            identifierA,
            identifierB
        ]
    };

    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as ISystemModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module does not have an #identifiers property`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');
    const identifierB = new TypedIdentifier<TestSystem>('TestSystemId2');

    const module = {
        type: 'system',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
    };

    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as ISystemModule<TestSystem>);
    }).toThrow();
});

test(`Should error if module has 0 identifiers`, () => {
    type TestSystem = { foo: 'foo' };

    const module = {
        type: 'system',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [],
    };

    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, () => { });

    expect(() => {
        strategy.load(module as unknown as ISystemModule<TestSystem>);
    }).toThrow();
});

test(`When #load() is called, should pass first identifier into #onSystemRegistered`, () => {
    type TestSystem = { foo: 'foo' };

    const identifierA = new TypedIdentifier<TestSystem>('TestSystemId1');

    const module: ISystemModule<TestSystem> = {
        type: 'system',
        name: 'TestSystemModule',
        factory: () => { return { foo: 'foo' } },
        identifiers: [
            identifierA,
        ],
    };

    const onSystemRegistered = jest.fn();
    const locator: ISystemRegistry = { registerSystemFactory: jest.fn() };
    const strategy = new SystemModuleLoaderStrategy(locator, onSystemRegistered);

    strategy.load(module);

    expect(onSystemRegistered).toHaveBeenCalledTimes(1);
    expect(onSystemRegistered).toHaveBeenCalledWith(identifierA);
});
