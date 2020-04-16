import { ILoggerSPI } from './ILoggerSPI';

export interface ILoggerProvider {
    getLogger(domain: string): ILoggerSPI;
}
