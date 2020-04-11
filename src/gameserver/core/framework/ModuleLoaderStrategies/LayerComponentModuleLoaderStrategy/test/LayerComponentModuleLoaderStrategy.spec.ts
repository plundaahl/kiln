import {
    LayerComponentModuleLoaderStrategy,
    ILayerElementModule,
} from '..';
import { TypedIdentifier } from '../../../TypedIdentifier';

describe(`#getType`, () => {
    test(`Should return the type passed into constructor param "typeString"`, () => {
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };

        const typeString = 'SomeTypeString';
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(loaderStrategy.getType()).toBe(typeString);
    });
});

describe(`#load`, () => {
    test(`Given module is valid, should register with layerManager`, () => {

        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        loaderStrategy.load({
            getType: () => 'FooComponent',
            getName: () => 'TestModule',
            create: () => 'module',
            identifiers: [new TypedIdentifier<string>('SomeTestModule')]
        } as ILayerElementModule<'FooComponent', {}>)

        expect(locator.registerModule).toHaveBeenCalled();
    });

    test(`Should error if types don't match`, () => {
        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(() => {
            loaderStrategy.load({
                getType: () => 'BarComponent',
                getName: () => 'TestModule',
                create: () => 'module',
                identifiers: [new TypedIdentifier<string>('SomeTestModule')]
            } as unknown as ILayerElementModule<'FooComponent', {}>)
        }).toThrowError();
    });

    test(`Should error if create not defined`, () => {
        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(() => {
            loaderStrategy.load({
                getType: () => 'FooComponent',
                getName: () => 'TestModule',
                identifiers: [new TypedIdentifier<string>('SomeTestModule')]
            } as unknown as ILayerElementModule<'FooComponent', {}>)
        }).toThrowError();
    });

    test(`Should error if identifiers undefined`, () => {
        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(() => {
            loaderStrategy.load({
                getType: () => 'FooComponent',
                getName: () => 'TestModule',
                create: () => 'module',
            } as unknown as ILayerElementModule<'FooComponent', {}>)
        }).toThrowError();
    });

    test(`Should error if identifiers not an array`, () => {
        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(() => {
            loaderStrategy.load({
                getType: () => 'FooComponent',
                getName: () => 'TestModule',
                create: () => 'module',
                identifiers: 'hi there',
            } as unknown as ILayerElementModule<'FooComponent', {}>)
        }).toThrowError();
    });

    test(`Should error if identifiers empty`, () => {
        const typeString = 'FooComponent';
        const locator = {
            initModules: jest.fn(),
            registerModule: jest.fn(),
        };
        const loaderStrategy = new LayerComponentModuleLoaderStrategy(
            locator,
            typeString,
        );

        expect(() => {
            loaderStrategy.load({
                getType: () => 'FooComponent',
                getName: () => 'TestModule',
                create: () => 'module',
                identifiers: [],
            } as unknown as ILayerElementModule<'FooComponent', {}>)
        }).toThrowError();
    });
});
