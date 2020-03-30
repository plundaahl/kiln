import { SystemManager } from '../SystemManager';
import {
    TypedIdentifier,
    ISystemLocator,
} from '../../../DependencyLocator';

test(`GIVEN I have passed one or more identifiers into #notifySystemRegistered, ` +
    `AND I have not called #initializeAllSystems, ` +
    `THEN SystemManager should not have called DependencyLocator #locateSystem.`,
    () => {
        const locator: ISystemLocator = { locateSystem: jest.fn() };

        const fooIdentifier = new TypedIdentifier<{ foo: 'foo' }>('FooSystem');
        const barIdentifier = new TypedIdentifier<{ bar: 'bar' }>('BarSystem');
        const bazIdentifier = new TypedIdentifier<{ baz: 'baz' }>('BazSystem');

        const systemManager = new SystemManager(locator);

        systemManager.notifySystemRegistered(fooIdentifier);
        systemManager.notifySystemRegistered(barIdentifier);
        systemManager.notifySystemRegistered(bazIdentifier);

        expect(locator.locateSystem).not.toHaveBeenCalled();
    });

test(`GIVEN I have passed one or more identifiers into #notifySystemRegistered, ` +
    `WHEN I call #initializeAllSystems, ` +
    `THEN SystemManager should pass each identifier once into DependencyLocator`,
    () => {
        const locator: ISystemLocator = { locateSystem: jest.fn() };

        const fooIdentifier = new TypedIdentifier<{ foo: 'foo' }>('FooSystem');
        const barIdentifier = new TypedIdentifier<{ bar: 'bar' }>('BarSystem');
        const bazIdentifier = new TypedIdentifier<{ baz: 'baz' }>('BazSystem');

        const systemManager = new SystemManager(locator);

        systemManager.notifySystemRegistered(fooIdentifier);
        systemManager.notifySystemRegistered(barIdentifier);
        systemManager.notifySystemRegistered(bazIdentifier);

        systemManager.initializeAllSystems();
        expect(locator.locateSystem).toHaveBeenCalledTimes(3);

        expect(locator.locateSystem).toHaveBeenCalledWith(fooIdentifier);
        expect(locator.locateSystem).toHaveBeenCalledWith(barIdentifier);
        expect(locator.locateSystem).toHaveBeenCalledWith(bazIdentifier);
    });
