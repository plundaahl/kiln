import { ServiceManager } from '../ServiceManager';
import {
    TypedIdentifier,
    IServiceLocator,
} from '../../../DependencyLocator';

test(`GIVEN I have passed one or more identifiers into #notifyServiceRegistered, ` +
    `AND I have not called #initializeAllServices, ` +
    `THEN ServiceManager should not have called DependencyLocator #locateService.`,
    () => {
        const locator: IServiceLocator = { locateService: jest.fn() };

        const fooIdentifier = new TypedIdentifier<{ foo: 'foo' }>('FooService');
        const barIdentifier = new TypedIdentifier<{ bar: 'bar' }>('BarService');
        const bazIdentifier = new TypedIdentifier<{ baz: 'baz' }>('BazService');

        const systemManager = new ServiceManager(locator);

        systemManager.notifyServiceRegistered(fooIdentifier);
        systemManager.notifyServiceRegistered(barIdentifier);
        systemManager.notifyServiceRegistered(bazIdentifier);

        expect(locator.locateService).not.toHaveBeenCalled();
    });

test(`GIVEN I have passed one or more identifiers into #notifyServiceRegistered, ` +
    `WHEN I call #initializeAllServices, ` +
    `THEN ServiceManager should pass each identifier once into DependencyLocator`,
    () => {
        const locator: IServiceLocator = { locateService: jest.fn() };

        const fooIdentifier = new TypedIdentifier<{ foo: 'foo' }>('FooService');
        const barIdentifier = new TypedIdentifier<{ bar: 'bar' }>('BarService');
        const bazIdentifier = new TypedIdentifier<{ baz: 'baz' }>('BazService');

        const systemManager = new ServiceManager(locator);

        systemManager.notifyServiceRegistered(fooIdentifier);
        systemManager.notifyServiceRegistered(barIdentifier);
        systemManager.notifyServiceRegistered(bazIdentifier);

        systemManager.initializeAllServices();
        expect(locator.locateService).toHaveBeenCalledTimes(3);

        expect(locator.locateService).toHaveBeenCalledWith(fooIdentifier);
        expect(locator.locateService).toHaveBeenCalledWith(barIdentifier);
        expect(locator.locateService).toHaveBeenCalledWith(bazIdentifier);
    });
