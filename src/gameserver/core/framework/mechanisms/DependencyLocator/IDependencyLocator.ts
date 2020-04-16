import { TypedIdentifier } from '../TypedIdentifier';

export interface IDependencyLocator {
    locate<T>(identifier: TypedIdentifier<T>): T;
}
