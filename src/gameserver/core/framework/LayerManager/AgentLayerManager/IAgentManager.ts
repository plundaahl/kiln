import { IPostWorldUpdateListener } from './IPostWorldUpdateListener';
import { IPreWorldUpdateListener } from './IPreWorldUpdateListener';
import { IFrameMetricProvider } from '../../GameLoopRunner';

export interface IAgentManager
    extends
    Partial<IPostWorldUpdateListener>,
    Partial<IPreWorldUpdateListener> {
}
