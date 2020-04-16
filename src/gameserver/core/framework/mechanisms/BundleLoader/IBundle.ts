import { IModule } from './IModule';

export type IBundle = {
    getName: () => string,
    getModules: () => IModule<string>[],
}
