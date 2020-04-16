import { IFrameMetricProvider } from '../../GameLoopRunner';

export interface IPreWorldUpdateListener {
    onPreWorldUpdate(frameMetricProvider: IFrameMetricProvider): void;
}
