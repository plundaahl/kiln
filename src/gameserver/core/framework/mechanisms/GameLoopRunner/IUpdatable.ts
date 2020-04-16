import { IFrameMetricProvider } from './IFrameMetricProvider';

export type IUpdatable<T extends string> = {
    [P in T]: (frameIntelProvider: IFrameMetricProvider) => void
}
