import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogSeverity } from '../shared/enums/log-severity.enum';
import { LogScope } from '../shared/enums/log-scope.enum';
import { Log } from './log.entity';
import { getStackTrace } from '../shared/utils/functions';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private readonly logRepository: Repository<Log>,
    ) {}

    async get(): Promise<Log[]> {
        return await this.logRepository.find();
    }

    async info(message: string, method?: string, data?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.INFO, typeof scope === 'string' ? LogScope[scope] : scope, data);
    }

    async warn(message: string, data?: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.WARN, typeof scope === 'string' ? LogScope[scope] : scope, data);
    }

    async error(message: string, error: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.ERROR, typeof scope === 'string' ? LogScope[scope] : scope, error);
    }

    async fatal(message: string, error: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.FATAL, typeof scope === 'string' ? LogScope[scope] : scope, error);
    }

    async debug(message: string, error: string, method?: string, scope: LogScope|string = LogScope.USER): Promise<Log> {
        return await this.create(message, method, LogSeverity.DEBUG, typeof scope === 'string' ? LogScope[scope] : scope, error);
    }

    private async create(message: string, method: string, severity: LogSeverity, scope: LogScope, data?: string): Promise<Log> {
        const log = new Log();
        log.method = method;
        log.message = message;
        log.scope = typeof scope === 'string' ? LogScope[scope] : scope;
        log.level = severity;
        log.data = data;
        log.stack = getStackTrace();

        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const logFileName = `${day}-${month}-${year}.log`;
        this.appendToLogFile(logFileName, log.toString());

        return await this.logRepository.save(log);
    }

    private appendToLogFile(fileName: string, log: string) {
        const fs = require('fs');
        const path = require('path');
        const logPath = path.join(__dirname, '..', '..', 'logs');
        if (!fs.existsSync(logPath)) {
            fs.mkdirSync(logPath);
        }
        const filePath = path.join(logPath, fileName);
        fs.appendFileSync(filePath, log);
    }
}
