import { IFrameMetricProvider } from '../../../mechanisms/GameLoopRunner';

export interface IPreWorldUpdateListener {
    onPreWorldUpdate(frameMetricProvider: IFrameMetricProvider): void;
}
