import { IModule } from './IModule';

export interface IModuleLoader {
    loadModules(...modules: IModule<string>[]): void;
}
