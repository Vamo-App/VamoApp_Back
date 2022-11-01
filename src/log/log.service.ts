import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogSeverity } from '../shared/enums/log-severity.enum';
import { LogScope } from '../shared/enums/log-scope.enum';
import { Log } from './log.entity';
import { appendToLogFile, sendLogEmail } from '../shared/utils/functions';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) {}

    async get(): Promise<Log[]> {
        return await this.logRepository.find();
    }

    async info(message: string, method?: string, data?: object, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.INFO, typeof scope === 'string' ? LogScope[scope] : scope, data, '');
    }

    async warn(message: string, data?: object, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.WARN, typeof scope === 'string' ? LogScope[scope] : scope, data, '');
    }

    async error(message: string, error: object, stack: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.ERROR, typeof scope === 'string' ? LogScope[scope] : scope, error, stack);
    }

    async fatal(message: string, error: object, stack: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.FATAL, typeof scope === 'string' ? LogScope[scope] : scope, error, stack);
    }

    async debug(message: string, error: object, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.DEBUG, typeof scope === 'string' ? LogScope[scope] : scope, error, '');
    }

    private async create(message: string, method: string, severity: LogSeverity, scope: LogScope, data: object, stack: string): Promise<Log> {
        const log = new Log();
        log.method = method;
        log.message = message;
        log.scope = typeof scope === 'string' ? LogScope[scope] : scope;
        log.level = severity;
        log.data = data ? JSON.stringify(data) : null;
        log.stack = stack;

        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1) > 9 ? (now.getMonth() + 1) : `0${now.getMonth() + 1}`;
        const day = now.getDate() > 9 ? now.getDate() : '0' + now.getDate();
        const logFileName = `${day}-${month}-${year}.log`;

        appendToLogFile(logFileName, log.toString());
        
        const infoLog = new Log();
        if (severity === LogSeverity.FATAL || severity === LogSeverity.ERROR) {
            const info = sendLogEmail(log.toHtmlString(data));
            if (typeof info === 'string') {
                const infolog: Log = new Log(); 
                infolog.method = 'sendLogEmail';
                infolog.message = info;
                infolog.scope = LogScope.SYSTEM;
                infolog.level = LogSeverity.INFO;
                const logSaved = await this.logRepository.save(log);
                await this.logRepository.save(infoLog);
                return logSaved;
            }
        }

        return await this.logRepository.save(log);
    }
}
