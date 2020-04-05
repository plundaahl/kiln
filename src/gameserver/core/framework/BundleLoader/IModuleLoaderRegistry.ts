import { IModuleLoaderStrategy } from './IModuleLoaderStrategy';

export interface IModuleLoaderRegistry {
    registerModuleLoaderStrategy(loader: IModuleLoaderStrategy<string>): void;
}
