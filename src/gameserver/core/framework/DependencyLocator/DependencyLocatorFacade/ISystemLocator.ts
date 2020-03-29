import { TypedIdentifier } from '../TypedIdentifier';

export interface ISystemLocator {
    locateSystem<T>(identifier: TypedIdentifier<T>): T;
}
