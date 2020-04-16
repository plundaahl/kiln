import {
    IModule,
    IModuleLoaderStrategy,
} from '../../BundleLoader';
import { IDependencyLocator } from '../../DependencyLocator';

export interface ILoaderModule extends IModule<'loader'> {
    createLoader(locator: IDependencyLocator): IModuleLoaderStrategy<string>
}
