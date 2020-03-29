import { TypedIdentifier } from '../TypedIdentifier';

export interface IServiceLocator {
    locateService<T>(identifier: TypedIdentifier<T>): T;
}
