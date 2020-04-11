import { ILoggerProvider } from '../ILoggerProvider'
import { ILoggerSPI } from '../ILoggerSPI'
import { ConsoleLoggerSPI } from './ConsoleLoggerSPI';
import { Level } from '../Level';

type ConsoleLoggerConfig = {
    defaultLevel: Level,
};

export class ConsoleLoggerProvider implements ILoggerProvider {
    private readonly config: ConsoleLoggerConfig = {
        defaultLevel: Level.OFF,
    };

    constructor(config: Partial<ConsoleLoggerConfig> = {}) {
        if (config.defaultLevel !== undefined) {
            this.config.defaultLevel = config.defaultLevel;
        }
    }

    getLogger(domain: string): ILoggerSPI {
        return new ConsoleLoggerSPI(this.config.defaultLevel, domain);
    }
}
