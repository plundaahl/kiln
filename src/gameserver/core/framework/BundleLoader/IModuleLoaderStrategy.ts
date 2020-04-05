import { IModule } from './IModule';

export interface IModuleLoaderStrategy<T extends string> {
    getType(): T;
    load(module: IModule<T>): void;
}
