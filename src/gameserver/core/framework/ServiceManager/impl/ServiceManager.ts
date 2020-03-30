import { IServiceManager } from '../IServiceManager';
import {
    TypedIdentifier,
    IServiceLocator,
} from '../../DependencyLocator';

export class ServiceManager implements IServiceManager {
    private readonly systemIdentifiers: TypedIdentifier<any>[] = [];

    constructor(
        private readonly dependencyLocator: IServiceLocator,
    ) {
        this.initializeAllServices = this.initializeAllServices.bind(this);
        this.notifyServiceRegistered = this.notifyServiceRegistered.bind(this);
    }

    initializeAllServices(): void {
        for (let system of this.systemIdentifiers) {
            this.dependencyLocator.locateService(system);
        }
    }

    notifyServiceRegistered(identifier: TypedIdentifier<any>): void {
        this.systemIdentifiers.push(identifier);
    }
}
