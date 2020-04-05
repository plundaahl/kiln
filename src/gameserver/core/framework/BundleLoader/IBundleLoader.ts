import { IBundle } from './IBundle';

export interface IBundleLoader {
    loadBundles(...bundle: IBundle[]): void;
}
