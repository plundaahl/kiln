import {
    IModule,
    IModuleLoaderStrategy,
} from '../../BundleLoader';
import {
    IServiceLocator,
    ISystemLocator,
} from '../../DependencyLocator';

export interface ILoaderModule extends IModule<'loader'> {
    createLoader(
        locator: IServiceLocator & ISystemLocator
    ): IModuleLoaderStrategy<string>
}
