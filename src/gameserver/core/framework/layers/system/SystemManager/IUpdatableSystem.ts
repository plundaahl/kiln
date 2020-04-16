import { IFrameMetricProvider, IUpdatable } from '../../../mechanisms/GameLoopRunner';

export interface IUpdatableSystem extends IUpdatable<'update'> {
    update(metricProvider: IFrameMetricProvider): void;
}
