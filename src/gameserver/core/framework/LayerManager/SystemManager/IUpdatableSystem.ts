import { IFrameMetricProvider, IUpdatable } from '../../GameLoopRunner';

export interface IUpdatableSystem extends IUpdatable<'update'> {
    update(metricProvider: IFrameMetricProvider): void;
}
