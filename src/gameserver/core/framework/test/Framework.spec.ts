import { TypedIdentifier } from '../DependencyLocator';
import {
    Framework,
    Bundle,
} from '..';

describe(`Bundle Loading`, () => {

    test(`GIVEN I create a new Framework, ` +
        `AND I provide one or more bundles containing ISystemModules, ` +
        `WHEN that Framework is instantiated, ` +
        `THEN each ISystemModule's factory function is called.`,
        () => {
            const testSystemModuleFactoryFn = jest.fn();

            const testBundle: Bundle = {
                name: 'TestBundle',
                modules: [
                    {
                        type: 'system',
                        name: 'TestSystemModule',
                        factory: testSystemModuleFactoryFn,
                        identifiers: [
                            new TypedIdentifier<any>('TestSystemModule'),
                        ],
                    }
                ]
            }

            const framework = new Framework({ bundles: [testBundle] });

            expect(testSystemModuleFactoryFn).toHaveBeenCalled();
        });

    test(`GIVEN I create a new Framework, ` +
        `AND I provide one or more bundles containing IServiceModules, ` +
        `WHEN that Framework is instantiated, ` +
        `THEN each IServiceModule's factory function is called.`,
        () => {
            const testServiceModuleFactoryFn = jest.fn();

            const testBundle: Bundle = {
                name: 'TestBundle',
                modules: [
                    {
                        type: 'service',
                        name: 'TestServiceModule',
                        factory: testServiceModuleFactoryFn,
                        identifiers: [
                            new TypedIdentifier<any>('TestServiceModule'),
                        ],
                    }
                ]
            }

            const framework = new Framework({ bundles: [testBundle] });

            expect(testServiceModuleFactoryFn).toHaveBeenCalled();
        });
});
