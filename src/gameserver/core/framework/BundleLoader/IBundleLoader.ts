import { IBundle } from './IBundle';

export interface IBundleLoader {
    loadBundle(bundle: IBundle): void;
}
