import { IServiceLocator } from './IServiceLocator';
import { IServiceRegistry } from './IServiceRegistry';
import { ISystemLocator } from './ISystemLocator';
import { ISystemRegistry } from './ISystemRegistry';

export interface IDependencyLocatorFacade
    extends IServiceLocator, IServiceRegistry, ISystemLocator, ISystemRegistry {

}
