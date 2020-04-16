import { Level } from '../Level';
import { ILoggerSPI } from '..';

const logLevelNames: { [P in Level]: string } = {
    [Level.OFF]: 'OFF',
    [Level.FATAL]: 'FATAL',
    [Level.ERROR]: 'ERROR',
    [Level.WARN]: 'WARN',
    [Level.INFO]: 'INFO',
    [Level.DEBUG]: 'DEBUG',
    [Level.TRACE]: 'TRACE',
    [Level.ALL]: 'ALL',
}

export class ConsoleLoggerSPI implements ILoggerSPI {

    constructor(
        private level: Level,
        private readonly domain?: string,
    ) { }

    log(level: Level, ...details: any[]): void {
        if (level <= this.level) {
            console.log(
                `${new Date(Date.now()).toISOString()} [${logLevelNames[level]}] ${this.domain ? `${this.domain}:` : ''}`,
                ...details
            );
        }
    }

    setLevel(level: Level): void {
        this.level = level;
    }


}
