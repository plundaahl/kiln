import { TypedIdentifier } from '../TypedIdentifier';

export interface IDependencyLocatorCore {

    /**
     * Returns the dependency associated with the identifier provided.
     *
     * @param identifier Identifier associated with the dependency you are trying to request.
     * @throws If no dependency with the given identifier is registered.
     * @throws If a circular dependency is detected.
     */
    locate<T>(identifier: TypedIdentifier<T>): T;
}
