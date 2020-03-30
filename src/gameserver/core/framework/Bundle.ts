import { IBundle } from './BundleLoader';
import { Module } from './ModuleLoaderStrategies';

export interface Bundle extends IBundle {
    modules: Module[],
}
