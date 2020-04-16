import { ILogger } from './ILogger';
import { ILoggerSPI } from './ILoggerSPI';
import { ILoggerProvider } from './ILoggerProvider';
import { Level } from './Level';
import { ConsoleLoggerProvider } from './ConsoleLogger';

export class Logger implements ILogger {

    public static readonly Level = Level;
    private static logProvider: ILoggerProvider;

    private constructor(
        private readonly logHandler: ILoggerSPI,
    ) { }

    static setProvider(loggerProvider: ILoggerProvider): void {
        if (this.logProvider !== undefined) {
            throw new Error(`Cannot change LoggerProvider at runtime.`);
        }

        Logger.logProvider = loggerProvider;
    }

    static getLogger(domain: string): ILogger {
        if (this.logProvider === undefined) {
            this.logProvider = new ConsoleLoggerProvider();
        }

        return new Logger(Logger.logProvider.getLogger(domain));
    }

    trace(...details: any[]): void {
        this.logHandler.log(Level.TRACE, ...details);
    }

    debug(...details: any[]): void {
        this.logHandler.log(Level.DEBUG, ...details);
    }

    info(...details: any[]): void {
        this.logHandler.log(Level.INFO, ...details);
    }

    warn(...details: any[]): void {
        this.logHandler.log(Level.WARN, ...details);
    }

    error(...details: any[]): void {
        this.logHandler.log(Level.ERROR, ...details);
    }

    fatal(...details: any[]): void {
        this.logHandler.log(Level.FATAL, ...details);
    }

    setLevel(level: Level): void {
        this.logHandler.setLevel(level);
    }
}
