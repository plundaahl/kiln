import { ILayerElementModule } from '../../mechanisms/ModuleLoaderStrategies/LayerComponentModuleLoaderStrategy';
import { AgentLayerManager } from './AgentLayerManager';

export type IAgentManagerModule<T> = ILayerElementModule<typeof AgentLayerManager.scope, T>;
