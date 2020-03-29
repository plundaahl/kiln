import { IModule } from './IModule';

export type IBundle = {
    name: String,
    modules: IModule<any>[],
}
