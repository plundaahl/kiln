import { IDependencyLocator } from '../DependencyLocator';
import { TypedIdentifier } from '../TypedIdentifier';
import { IUpdatable } from './IUpdatable';

const MS_PER_SECOND = 1000;

export class GameLoopRunner {

    private readonly updatableList: IUpdatable[] = [];
    private timer: NodeJS.Timeout;
    private targetTimePerFrame: number;
    private lastFrameStartTime: number;

    constructor(
        locator: IDependencyLocator,
        ticksPerSecond: number,
        identifiers: TypedIdentifier<IUpdatable>[],
    ) {
        for (let identifier of identifiers) {
            this.updatableList.push(locator.locate(identifier));
        }

        this.targetTimePerFrame = MS_PER_SECOND / ticksPerSecond;
        this.update = this.update.bind(this);
    }

    start(): void {
        this.update();
    }

    stop(): void {
        if (this.timer) {
            clearTimeout(this.timer);
            delete this.timer;
        }
    }

    private update(): void {
        const startTime = Date.now();
        const timeSinceLastFrame = startTime - this.lastFrameStartTime;

        for (let updatable of this.updatableList) {
            updatable.update(timeSinceLastFrame);
        }

        const stopTime = Date.now();
        const timeToNextFrame = Math.max(
            this.targetTimePerFrame - (stopTime - startTime),
            0
        );

        this.lastFrameStartTime = startTime;
        this.timer = setTimeout(this.update, timeToNextFrame);
    }
}
