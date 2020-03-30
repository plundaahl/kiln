import { TypedIdentifier } from '../DependencyLocator';

export interface IServiceManager {
    initializeAllServices(): void;
    notifyServiceRegistered(identifier: TypedIdentifier<any>): void;
}
