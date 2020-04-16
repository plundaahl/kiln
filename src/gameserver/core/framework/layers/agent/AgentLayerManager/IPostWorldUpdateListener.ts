import { IFrameMetricProvider } from '../../../mechanisms/GameLoopRunner';

export interface IPostWorldUpdateListener {
    onPostWorldUpdate(frameMetricProvider: IFrameMetricProvider): void;
}
