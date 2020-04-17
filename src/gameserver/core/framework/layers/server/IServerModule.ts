import { ServerManager } from './ServerManager';
import { IModule } from '../../mechanisms/BundleLoader';

export interface IServerModule extends IModule<typeof ServerManager.scope> {

}
