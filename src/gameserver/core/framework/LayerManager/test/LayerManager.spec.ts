import { LayerManager } from '..';
import { IDependencyLocator, IDependencyRegistry } from '../../DependencyLocator';
import { TypedIdentifier } from '../../TypedIdentifier';

describe(`#registerModule`, () => {
    test(`Should error if no identifiers provided`, () => {
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: jest.fn(),
        };

        const manager = new LayerManager(
            locator,
            'someScope',
            ['someOtherScope'],
        );

        expect(() => manager.registerModule(() => { })).toThrowError();
    });

    test(`Should call dependencyLocator #registerDependency`, () => {
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: jest.fn(),
        };

        const manager = new LayerManager(
            locator,
            'someScope',
            ['someOtherScope'],
        );

        manager.registerModule(() => { }, new TypedIdentifier<{}>('SomeID'));
        expect(locator.registerDependency).toHaveBeenCalled();
    });

    test(`Should use scope from constructor when registering dependency`, () => {
        let arg: any;
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: (dependency: any) => { arg = dependency },
        };

        const manager = new LayerManager(
            locator,
            'someScope',
            ['someOtherScope'],
        );

        manager.registerModule(() => { }, new TypedIdentifier<{}>('SomeID'));
        expect(arg.scope).toBe('someScope');
    });

    test(`Should use queryableScopes from constructor when registering dependency`, () => {
        let arg: any;
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: (dependency: any) => { arg = dependency },
        };

        const queryableScopes = ['someOtherScope'];
        const manager = new LayerManager(
            locator,
            'someScope',
            queryableScopes,
        );

        manager.registerModule(() => { }, new TypedIdentifier<{}>('SomeID'));
        expect(arg.queryableScopes).toBe(queryableScopes);
    });

    test(`Should use provided identifiers when registering dependency`, () => {
        let arg: any;
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: (dependency: any) => { arg = dependency },
        };

        const manager = new LayerManager(
            locator,
            'someScope',
            ['someOtherScope'],
        );

        const identifiers = [new TypedIdentifier<{}>('SomeID')]
        manager.registerModule(() => { }, ...identifiers);

        expect(Array.isArray(arg.identifiers)).toBeTruthy();
        expect(arg.identifiers.length).toBe(identifiers.length);
        expect(arg.identifiers[0]).toBe(identifiers[0]);
    });

    test(`Should use provided create function when registering dependency`, () => {
        let arg: any;
        const locator: IDependencyLocator & IDependencyRegistry = {
            locate: jest.fn(),
            registerDependency: (dependency: any) => { arg = dependency },
        };

        const manager = new LayerManager(
            locator,
            'someScope',
            ['someOtherScope'],
        );

        const create = () => { };
        manager.registerModule(create, new TypedIdentifier<{}>('SomeID'));
        expect(arg.create).toBe(create);
    });
});
