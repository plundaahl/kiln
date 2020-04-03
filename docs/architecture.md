# Game Server Architecture


## Kiln's Core Framework
The core of Kiln's Game Server is a simple framework, which is responsible for the following key areas:

- Enforcing its [architectural layers](#Architectural-Layers).
- Providing a mechanism for loading game code and content as [modules](#Module-Loading).
- Providing [dependency resolution](#Dependency-Resolution) mechanism.
- Providing an [entity framework](#Entity-Framework) for objects in the game


### Architectural Layers
Kiln's architecture is divided up into several key architectural layers:

- **Connectivity:** A lightweight layer that allows users to connect to the game instance by housing, e.g., websocket servers.
- **Controller:** Controllers inject behavior into the game. Players, NPC scripts, etc. live here.
- **Service:** Services give the core game systems an API layer. By having all players and scripts to interact with the game world through a service layer, we have a single layer that is responsible for enforcing business logic.
- **System:** This layer contains the core systems of the game.

Classes in each layer can only access dependencies in the layer below. The exception is Systems, which may access each other (though this should be limited as much as possible).


### Module Loading
Kiln's Framework provides a module loading mechanism, which is capable of loading systems, services, controllers, connectivity servers, and content. Modules may explicitly depend on one another, as detailed in [dependency resolution](#Dependency-Resolution). Additionally, by default, Kiln expects to receive individual modules packaged together in groups, called Bundles, making it simple to deliver interdependent elements as a single package.


### Dependency Resolution
Kiln provides dependency resolution via a slightly modified implementation of the [Service Locator](https://gameprogrammingpatterns.com/service-locator.html) pattern. Kiln calls these `DependencyLocators`, as "service" refers to a specific architectural layer.

Dependencies are registered as factory functions. When a dependency is first requested, Kiln's `DependencyLocator` will run the factory function. When the factory returns, it will store a reference to the instance returned from the factory, and on every subsequent request, will return the instance instead of the factory.

Each architectural layer maintains its own `DependencyLocator`. When a dependency's factory function is called, the appropriate `DependencyLocator` for the current architectural layer is passed in, allowing the factory function to request any dependencies it a) needs and b) should have access to. For example, Services only have access to dependencies in the Systems layer, Controllers only have access to dependencies in the Services layer, etc.

Dependencies identify themselves, and are requested, using a `TypedIdentifier`. This is a parameterized wrapper around JavaScript's built-in Symbol type. As Symbols are used instead of strings, naming collisions are not an issue. In addition, in order to locate a dependency, one must be able to import the `TypedIdentifier`. This makes it simple to create private modules - just don't export the module's identifier.

`TypedIdentifier`s are also parameterized with the type of dependency they apply to. This allows you to write typed code when requesting dependencies. e.g.:

```javascript
// BarSystem
export interface IBarSystem {
    bar(): void;
}
export const barSystemIdentifier = new TypedIdentifier<IBarSystem>('BarSystem');

// FooService
import { IBarSystem, barSystemIdentifier } from 'BarSystem';
class FooService {
    constructor(barSystem: IBarSystem) {
        // ...
    }
}

export function fooServiceFactory(systemLocator: DependencyLocator) {
    // The following type checks correctly due to the parameterized TypeIdentifier.
    return new FooService(
        systemLocator.locate(barSystemIdentifier),
    );
}
```

Additionally, Kiln's `DependencyLocator`s make it simple to practice interface segregation by allowing you to register services with multiple identifiers. If you want to make different subsets of your dependency's API available via different identifiers, you can.


### Entity Framework
_TODO_
