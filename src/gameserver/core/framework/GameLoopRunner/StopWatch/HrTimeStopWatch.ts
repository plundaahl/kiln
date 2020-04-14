import { TimeUnit } from './TimeUnit';
import { IStopWatch } from './IStopWatch';

const SECONDS_TO_NS = Math.pow(10, -(TimeUnit.NANOSECONDS));
const NS_TO_SECONDS = Math.pow(10, TimeUnit.NANOSECONDS);
const NS_TO_MS = Math.pow(10, TimeUnit.NANOSECONDS - TimeUnit.MILLISECONDS);

export class HrTimeStopWatch implements IStopWatch {
    private lastReset: [number, number] = [0, 0];

    reset(offset: number = 0, unit: TimeUnit = TimeUnit.NANOSECONDS): void {
        const time = process.hrtime();
        const offsetInNs = offset * Math.pow(10, (unit - TimeUnit.NANOSECONDS));

        this.lastReset = [
            time[0] + Math.round(offsetInNs * NS_TO_SECONDS),
            time[1] + Math.round(offsetInNs % SECONDS_TO_NS),
        ];
    }

    getCountNanoseconds(): number {
        const timeSinceReset = process.hrtime(this.lastReset);
        return (timeSinceReset[0] * SECONDS_TO_NS) + timeSinceReset[1];
    }

    getCountMilliseconds(): number {
        return this.getCountNanoseconds() * NS_TO_MS;
    }

}
