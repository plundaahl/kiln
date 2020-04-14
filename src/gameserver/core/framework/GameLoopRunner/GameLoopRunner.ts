import { IFrameMetricProvider } from './IFrameMetricProvider';
import { IGameLoopRunnerConfig } from './IGameLoopRunnerConfig';
import { IUpdatable } from './IUpdatable';
import { IUpdatableEntry } from './IUpdatableEntry';
import { IStopWatch, HrTimeStopWatch, TimeUnit } from './StopWatch';

type UpdateFn = (metricProvider: IFrameMetricProvider) => void;

const NS_PER_SECOND = Math.pow(10, 9);
const MS_PER_SECOND = Math.pow(10, 3);

export class GameLoopRunner {

    // Updatable Module Details
    private readonly moduleNames: string[] = [];
    private readonly moduleUpdateFns: UpdateFn[] = [];

    // GameLoopRunner State
    private readonly config: IGameLoopRunnerConfig;
    private readonly metricProvider: IFrameMetricProvider;
    private readonly frameStopWatch: IStopWatch;
    private readonly moduleStopWatch: IStopWatch;
    private timeout: NodeJS.Timeout;
    private curFrameLength: number;

    constructor(
        config: IGameLoopRunnerConfig,
        entries: IUpdatableEntry<string>[],
    ) {
        this.config = config;
        this.frameStopWatch = new HrTimeStopWatch();
        this.moduleStopWatch = new HrTimeStopWatch();
        this.loadEntries(entries);

        this.update = this.update.bind(this);
        this.getCurrentFrameLength = this.getCurrentFrameLength.bind(this)

        this.metricProvider = {
            getCurFrameLength: this.getCurrentFrameLength,
        };
    }

    start(): void {
        this.frameStopWatch.reset(
            -(NS_PER_SECOND / this.config.ticksPerSecond),
            TimeUnit.NANOSECONDS,
        );
        this.update();
    }

    stop(): void {
        clearTimeout(this.timeout);
        delete this.timeout;
    }

    private loadEntries(entries: Array<IUpdatableEntry<string>>): void {
        for (let id = 0; id < entries.length; id++) {
            const entry = entries[id];

            const name = entry[0].constructor.name;
            const updateFn = entry[0][entry[1]].bind(entry[0]);

            this.moduleNames[id] = name;
            this.moduleUpdateFns[id] = updateFn;
        }
    }

    private update(): void {
        const { frameStopWatch, moduleStopWatch } = this;

        this.curFrameLength = frameStopWatch.getCountNanoseconds();
        frameStopWatch.reset();

        for (let updateModule of this.moduleUpdateFns) {
            moduleStopWatch.reset();
            updateModule(this.metricProvider);
        }

        this.timeout = setTimeout(
            this.update,
            Math.max(0, this.getTargetFrameLengthInMs() - frameStopWatch.getCountMilliseconds()),
        );
    }

    private getTargetFrameLengthInMs(): number {
        return MS_PER_SECOND / this.config.ticksPerSecond;
    }

    private getCurrentFrameLength(): number {
        return this.curFrameLength;
    }
}
