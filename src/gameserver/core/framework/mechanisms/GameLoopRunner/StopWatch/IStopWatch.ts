import { TimeUnit } from './TimeUnit';

export interface IStopWatch {
    reset(offset?: number, unit?: TimeUnit): void;
    getCountNanoseconds(): number;
    getCountMilliseconds(): number;
}
