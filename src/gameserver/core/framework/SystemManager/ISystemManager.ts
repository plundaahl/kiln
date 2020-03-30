import { TypedIdentifier } from '../DependencyLocator';

export interface ISystemManager {
    initializeAllSystems(): void;
    notifySystemRegistered(identifier: TypedIdentifier<any>): void;
}
