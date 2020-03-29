import { IModule } from './IModule';

export interface IModuleLoaderStrategy<T extends String, M extends IModule<T>> {
    readonly type: T;
    load(module: M): void;
}
