import { ILayerElementModule } from './ILayerElementModule';
import { ILayerManager } from '../../LayerManager';
import {
    IModuleLoaderStrategy,
    IModule
} from '../../BundleLoader';

export class LayerComponentModuleLoaderStrategy<T extends string>
    implements IModuleLoaderStrategy<T> {

    constructor(
        private readonly layerManager: ILayerManager,
        private readonly typeString: T,
    ) { }

    getType(): T {
        return this.typeString;
    }

    load(module: IModule<T>): void {
        const _module = this.parseModule(module);
        const { create, identifiers } = _module;

        this.layerManager.registerModule(create, ...identifiers)
    }

    private parseModule(module: IModule<T>): ILayerElementModule<T, any> {
        const type = module.getType();
        if (type !== this.typeString) {
            throw new Error(`Tried to register module ${module.getName()} with `
                + `invalid type ${type}. `
                + `Allowed modules must be of type ${this.getType()}`
                + `Offending module: ${module}`);
        }

        const parsedModule = module as ILayerElementModule<T, any>;
        if (parsedModule.create === undefined) {
            throw new Error(`Module ${module.getName()} contains no #create() function`);
        }

        const { identifiers } = parsedModule;
        if (identifiers === undefined) {
            throw new Error(`Module ${module} contains no "identifiers" property`);
        }
        if (!Array.isArray(identifiers)) {
            throw new Error(`Module ${module} "identifiers" property is not an array`);
        }
        if (identifiers.length === 0) {
            throw new Error(`Module ${module} must have at least one identifier`);
        }

        return parsedModule;
    }
}
