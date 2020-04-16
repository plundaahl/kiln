import { DependencyLocator } from '../../../../mechanisms/DependencyLocator';
import { TypedIdentifier } from '../../../../mechanisms/TypedIdentifier';
import {
    SystemManager,
    IUpdatableSystem,
} from '..';

describe(`getUpdatableSystems`, () => {
    test(`Should return one system for each specified`, () => {
        const locator = new DependencyLocator();


        const systemAIdentifier = new TypedIdentifier<IUpdatableSystem>('systemA');
        const systemBIdentifier = new TypedIdentifier<IUpdatableSystem>('systemB');
        const systemCIdentifier = new TypedIdentifier<IUpdatableSystem>('systemC');
        const systemA: IUpdatableSystem = { update: jest.fn() };
        const systemB: IUpdatableSystem = { update: jest.fn() };
        const systemC: IUpdatableSystem = { update: jest.fn() };

        const scope = 'system';
        const queryableScopes = [scope];

        locator.registerDependency({
            scope,
            queryableScopes,
            create: () => systemA,
            identifiers: [systemAIdentifier],
        });

        locator.registerDependency({
            scope,
            queryableScopes,
            create: () => systemB,
            identifiers: [systemBIdentifier],
        });

        locator.registerDependency({
            scope,
            queryableScopes,
            create: () => systemC,
            identifiers: [systemCIdentifier],
        });

        const systemManager = new SystemManager(
            locator,
            [
                systemBIdentifier,
                systemAIdentifier,
                systemCIdentifier,
            ],
        );

        const updatables = systemManager.getUpdatableSystems();
        expect(updatables).toHaveLength(3);
        expect(updatables[0]).toBe(systemB);
        expect(updatables[1]).toBe(systemA);
        expect(updatables[2]).toBe(systemC);
    });
});
