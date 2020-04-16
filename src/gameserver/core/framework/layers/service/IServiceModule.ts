import { ILayerElementModule } from '../../mechanisms/ModuleLoaderStrategies/LayerComponentModuleLoaderStrategy';
import { ServiceManager } from './ServiceManager';

export type IServiceModule<T> = ILayerElementModule<typeof ServiceManager.scope, T>;
