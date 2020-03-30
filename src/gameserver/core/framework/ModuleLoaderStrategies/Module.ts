import { IServiceModule } from './ServiceModuleLoaderStrategy';
import { ISystemModule } from './SystemModuleLoaderStrategy';

export type Module =
    IServiceModule<any>
    | ISystemModule<any>
    ;
