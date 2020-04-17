import {
    IModule,
    IModuleLoaderStrategy,
} from '../../BundleLoader';
import { IDependencyLocator } from '../../DependencyLocator';

import { LoaderModuleLoaderStrategy } from './LoaderModuleLoaderStrategy';

export interface ILoaderModule extends IModule<typeof LoaderModuleLoaderStrategy.typeName> {
    createLoader(locator: IDependencyLocator): IModuleLoaderStrategy<string>
}
