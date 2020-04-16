import { TypedIdentifier } from '../mechanisms/TypedIdentifier';
import { Framework } from '..';
import { IBundle } from '../mechanisms/BundleLoader';
import {
    ServiceManager,
    SystemManager,
    ISystemModule,
    IServiceModule,
} from '../layers';

describe(`Bundle Loading`, () => {

    test(`GIVEN I create a new Framework, ` +
        `AND I provide one or more bundles containing ISystemModules, ` +
        `WHEN that Framework is instantiated, ` +
        `THEN each ISystemModule's factory function is called.`,
        () => {
            const testSystemModuleFactoryFn = jest.fn();

            const testBundle: IBundle = {
                getName: () => 'TestBundle',
                getModules: () => [
                    ({
                        getType: () => SystemManager.scope,
                        getName: () => 'TestSystemModule',
                        create: testSystemModuleFactoryFn,
                        identifiers: [
                            new TypedIdentifier<any>('TestSystemModule'),
                        ],
                    } as ISystemModule<any>)
                ]
            }

            new Framework({
                bundles: [testBundle],
                systemUpdateOrder: [],
            });
            expect(testSystemModuleFactoryFn).toHaveBeenCalled();
        });

    test(`GIVEN I create a new Framework, ` +
        `AND I provide one or more bundles containing IServiceModules, ` +
        `WHEN that Framework is instantiated, ` +
        `THEN each IServiceModule's factory function is called.`,
        () => {
            const testServiceModuleFactoryFn = jest.fn();

            const testBundle: IBundle = {
                getName: () => 'TestBundle',
                getModules: () => [
                    ({
                        getType: () => ServiceManager.scope,
                        getName: () => 'TestServiceModule',
                        create: testServiceModuleFactoryFn,
                        identifiers: [
                            new TypedIdentifier<any>('TestServiceModule'),
                        ],
                    } as IServiceModule<any>)
                ]
            }

            new Framework({
                bundles: [testBundle],
                systemUpdateOrder: [],
            });

            expect(testServiceModuleFactoryFn).toHaveBeenCalled();
        });
});
