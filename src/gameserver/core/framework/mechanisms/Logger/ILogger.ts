import { Level } from './Level';

export interface ILogger {
    trace(...details: any[]): void;
    debug(...details: any[]): void;
    info(...details: any[]): void;
    warn(...details: any[]): void;
    error(...details: any[]): void;
    fatal(...details: any[]): void;
    setLevel(level: Level): void;
}
