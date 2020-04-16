import { ILayerElementModule } from './LayerComponentModuleLoaderStrategy';
import { ILoaderModule } from './LoaderModuleLoaderStrategy';

type ISystemModule<T> = ILayerElementModule<'system', T>;
type IServiceModule<T> = ILayerElementModule<'service', T>;
type IControllerModule<T> = ILayerElementModule<'controller', T>;

export {
    ILoaderModule,
    IServiceModule,
    ISystemModule,
    IControllerModule,
};
