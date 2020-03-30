import { IModule } from './IModule';

export interface IModuleLoaderStrategy<T extends String, M extends IModule<T>> {
    loadsType(): T;
    load(module: M): void;
}
