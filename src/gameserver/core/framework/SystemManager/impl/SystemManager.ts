import { ISystemManager } from '../ISystemManager';
import {
    TypedIdentifier,
    ISystemLocator,
} from '../../DependencyLocator';

export class SystemManager implements ISystemManager {
    private readonly systemIdentifiers: TypedIdentifier<any>[] = [];

    constructor(
        private readonly dependencyLocator: ISystemLocator,
    ) {
        this.initializeAllSystems = this.initializeAllSystems.bind(this);
        this.notifySystemRegistered = this.notifySystemRegistered.bind(this);
    }

    initializeAllSystems(): void {
        for (let system of this.systemIdentifiers) {
            this.dependencyLocator.locateSystem(system);
        }
    }

    notifySystemRegistered(identifier: TypedIdentifier<any>): void {
        this.systemIdentifiers.push(identifier);
    }
}
