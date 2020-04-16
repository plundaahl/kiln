import { IFrameMetricProvider } from '../../GameLoopRunner';

export interface IPostWorldUpdateListener {
    onPostWorldUpdate(frameMetricProvider: IFrameMetricProvider): void;
}
