import { ILayerElementModule } from '../../mechanisms/ModuleLoaderStrategies/LayerComponentModuleLoaderStrategy';
import { SystemManager } from './SystemManager';

export type ISystemModule<T> = ILayerElementModule<typeof SystemManager.scope, T>;
