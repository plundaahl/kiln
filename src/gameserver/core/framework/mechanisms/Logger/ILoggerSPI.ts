import { Level } from './Level';

export interface ILoggerSPI {
    log(level: Level, ...info: any[]): void;
    setLevel(level: Level): void;
}
