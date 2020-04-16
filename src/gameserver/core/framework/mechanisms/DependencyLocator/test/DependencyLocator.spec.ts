import { DependencyLocator } from '..';
import { TypedIdentifier } from '../../TypedIdentifier';

describe(`#registerDependency`, () => {
    test(`#registerDependency should error if the same identifier is registered twice in locator's lifetime`, () => {
        // Given I have a DependencyLocator
        // And I have a TypedIdentifier N
        // And I have registered a dependency using that TypedIdentifier N
        // When I register another dependency using the same TypedIdentifier N
        // Then #registerDependency should error

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');

        type FooDependency = { foo: string };

        locator.registerDependency({
            scope: 'scope',
            queryableScopes: [],
            identifiers: [identifier],
            create: () => ({ foo: 'foo' }),
        });

        expect(() => locator.registerDependency({
            scope: 'scope',
            queryableScopes: [],
            identifiers: [identifier],
            create: () => ({ foo: 'bar' }),
        })).toThrowError();
    });

    test(`Registered dependency should be accessible in scope it was registered with`, () => {
        // Given I have a DependencyLocator
        // And I register a dependency with some scope S and some identifier T
        // When I attempt to locate that identifier T
        // And my list of scopes contains scope S
        // Then #locate should return an instance

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const scope = 'someScope';
        const requestScopes = [
            'otherScope',
            'aThirdScope',
            scope,
        ];

        type FooDependency = { foo: string };

        const instance = { foo: 'foo' };
        locator.registerDependency({
            scope,
            queryableScopes: [],
            identifiers: [identifier],
            create: () => instance,
        });

        expect(() => locator.locate(identifier, requestScopes)).not.toThrowError();
        expect(locator.locate(identifier, requestScopes)).toBe(instance);
    });

    test(`Registered dependency should NOT be accessible outside scope it was registered with`, () => {
        // Given I have a DependencyLocator
        // And I register a dependency with some scope S and some identifier T
        // When I attempt to locate that identifier T, but a different scope Z
        // Then #locate should error

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const scope = 'someScope';
        const requestScopes = [
            'notMyScope',
            'alsoNotMyScope',
        ];

        type FooDependency = { foo: string };

        locator.registerDependency({
            scope,
            queryableScopes: [],
            identifiers: [identifier],
            create: () => ({ foo: 'foo' }),
        });

        expect(() => locator.locate(identifier, requestScopes)).toThrowError();
    });


});

describe(`#locate`, () => {
    test(`#locate should error if provided identifier is not registered`, () => {
        // Given I have not registered a dependency with some identifier I
        // When I #locate with that identifier I
        // Then #locate should error

        type FooDependency = { foo: string };

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');

        expect(() => locator.locate(identifier)).toThrowError();
    });

    test(`#locate should return dependency if all conditions are met`, () => {
        // Given I have registered some root dependency with some identifier I
        // And I have registered its dependencies with some set of identifiers J
        // And all sub dependencies are within the root dependency's queryableScopes
        // And the sub dependencies have all their dependencies met
        // And there are no circular dependencies
        // When I #locate the dependency
        // Then it should return the dependency

        type RootDependency = { isRoot: boolean };
        type SubDependencyA = {};
        type SubDependencyB = {};

        const rootIdentifier = new TypedIdentifier<RootDependency>('RootDependency');
        const subIdentifierA = new TypedIdentifier<SubDependencyA>('SubDependencyA');
        const subIdentifierB = new TypedIdentifier<SubDependencyB>('SubDependencyB');
        const scope = 'someScope';

        const locator = new DependencyLocator();
        const instance = { isRoot: true };

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [rootIdentifier],
            create: (locate): RootDependency => {
                locate(subIdentifierA);
                locate(subIdentifierB);
                return instance;
            }
        });

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [subIdentifierA],
            create: (locate): SubDependencyA => {
                locate(subIdentifierB);
                return {};
            }
        });

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [subIdentifierB],
            create: (): SubDependencyB => ({}),
        });

        expect(() => locator.locate(rootIdentifier)).not.toThrowError();
        expect(locator.locate(rootIdentifier)).toBe(instance);
    });

    test(`#locate should error on circular dependencies`, () => {
        // Given I register a circular set of dependencies
        // When I #locate one of those dependencies
        // Then #locate should error

        type DependencyA = {};
        type DependencyB = {};
        type DependencyC = {};

        const identifierA = new TypedIdentifier<DependencyA>('DependencyA');
        const identifierB = new TypedIdentifier<DependencyB>('DependencyB');
        const identifierC = new TypedIdentifier<DependencyC>('DependencyC');
        const scope = 'someScope';

        const locator = new DependencyLocator();

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [identifierA],
            create: (locate): DependencyA => {
                locate(identifierB);
                return {};
            }
        });

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [identifierB],
            create: (locate): DependencyB => {
                locate(identifierC);
                return {};
            }
        });

        locator.registerDependency({
            scope,
            queryableScopes: [scope],
            identifiers: [identifierC],
            create: (locate): DependencyC => {
                locate(identifierA);
                return {};
            },
        });

        expect(() => locator.locate(identifierA)).toThrowError();
    });

    test(`If inScopes is provided, #locate should error if requested dependency is not registered under one of provided scopes`, () => {
        // Given I register a dependency with some scope S and identifier I
        // When I #locate with identifier I, but inScopes does NOT include scope S
        // Then it should error

        type FooDependency = { foo: string };

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const registeredScope = 'someScope';
        const requestedScope = 'someOtherScope';

        locator.registerDependency({
            scope: registeredScope,
            queryableScopes: [],
            identifiers: [identifier],
            create: (): FooDependency => ({ foo: 'foo' }),
        });

        expect(() => locator.locate(identifier, [requestedScope])).toThrowError();
    });

    test(`A dependency's #create function is not called until it is located`, () => {
        // Given I register a dependency with identifier I
        // And I have not requested that dependency yet
        // Then that dependency's #create function should NOT have been called

        type FooDependency = { foo: string };

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const scope = 'someScope';

        const createFn = jest.fn();

        locator.registerDependency({
            scope,
            queryableScopes: [],
            identifiers: [identifier],
            create: (): FooDependency => {
                createFn();
                return { foo: 'foo' };
            },
        });

        expect(createFn).not.toHaveBeenCalled();
    });
    test(`The first time a dependency is requested, its factory function should be called`, () => {
        // Given I register a dependency with identifier I
        // And I have not requested that dependency yet
        // When I #locate with identifier I
        // Then that dependency's #create function should be called

        type FooDependency = { foo: string };

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const scope = 'someScope';

        const createFn = jest.fn();

        locator.registerDependency({
            scope,
            queryableScopes: [],
            identifiers: [identifier],
            create: (): FooDependency => {
                createFn();
                return { foo: 'foo' };
            },
        });

        locator.locate(identifier);
        expect(createFn).toHaveBeenCalled();
    });

    test(`If a dependency has already been requested once, its factory function should NOT be called`, () => {
        // Given I register a dependency with identifier I
        // And I have requested that dependency
        // When I request that dependency a second time
        // Then that dependency's #create function should NOT be called again

        type FooDependency = { foo: string };

        const locator = new DependencyLocator();
        const identifier = new TypedIdentifier<FooDependency>('test.FooDependency');
        const scope = 'someScope';

        const createFn = jest.fn();

        locator.registerDependency({
            scope,
            queryableScopes: [],
            identifiers: [identifier],
            create: (): FooDependency => {
                createFn();
                return { foo: 'foo' };
            },
        });

        locator.locate(identifier);
        locator.locate(identifier);
        expect(createFn).toHaveBeenCalledTimes(1);
    });
});

describe(`Dependency access from within dependency #create functions`, () => {
    test(`Registered dependency should be able to request dependencies from its queryableScopes`, () => {
        // Give I register a dependency
        // And it has some set of queryableScopes S
        // And its create function requests dependencies from that set of scopes S
        // And I register its dependencies
        // When I #locate that dependency
        // Then it should not error

        type RootDependency = {};
        type SubDependencyA = {};
        type SubDependencyB = {};

        const locator = new DependencyLocator();
        const rootIdentifier = new TypedIdentifier<RootDependency>('test.RootDependency');
        const subAIdentifier = new TypedIdentifier<SubDependencyA>('test.SubDependencyA');
        const subBIdentifier = new TypedIdentifier<SubDependencyB>('test.SubDependencyB');
        const scopeRoot = 'scopeRoot';
        const scopeA = 'scopeA';
        const scopeB = 'scopeB';
        const queryableScopes = [scopeA, scopeB];

        locator.registerDependency({
            scope: scopeRoot,
            queryableScopes,
            identifiers: [rootIdentifier],
            create: (locate): RootDependency => {
                locate(subAIdentifier);
                locate(subBIdentifier);
                return {};
            }
        });

        locator.registerDependency({
            scope: scopeA,
            queryableScopes: [],
            identifiers: [subAIdentifier],
            create: (): SubDependencyA => ({}),
        });

        locator.registerDependency({
            scope: scopeB,
            queryableScopes: [],
            identifiers: [subBIdentifier],
            create: (): SubDependencyB => ({}),
        });

        expect(() => locator.locate(rootIdentifier)).not.toThrowError();
    });

    test(`Registered dependency should NOT be able to request dependencies from outside its queryableScopes`, () => {
        // Give I register a dependency
        // And it has some set of queryableScopes S
        // And its create function requests dependencies from a dependency outside that set of scopes S
        // And I register its dependencies
        // When I #locate that dependency
        // Then it should error

        type RootDependency = {};
        type SubDependencyA = {};
        type SubDependencyB = {};

        const locator = new DependencyLocator();
        const rootIdentifier = new TypedIdentifier<RootDependency>('test.RootDependency');
        const subAIdentifier = new TypedIdentifier<SubDependencyA>('test.SubDependencyA');
        const subBIdentifier = new TypedIdentifier<SubDependencyB>('test.SubDependencyB');
        const scopeRoot = 'scopeRoot';
        const scopeA = 'scopeA';
        const scopeB = 'scopeB';
        const queryableScopes = [scopeA];

        locator.registerDependency({
            scope: scopeRoot,
            queryableScopes,
            identifiers: [rootIdentifier],
            create: (locate): RootDependency => {
                locate(subAIdentifier);
                locate(subBIdentifier);
                return {};
            }
        });

        locator.registerDependency({
            scope: scopeA,
            queryableScopes: [],
            identifiers: [subAIdentifier],
            create: (): SubDependencyA => ({}),
        });

        locator.registerDependency({
            scope: scopeB,
            queryableScopes: [],
            identifiers: [subBIdentifier],
            create: (): SubDependencyB => ({}),
        });

        expect(() => locator.locate(rootIdentifier)).toThrowError();
    });
});
