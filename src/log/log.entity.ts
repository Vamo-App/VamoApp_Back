import { CreateDateColumn, Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { LogSeverity } from '../shared/enums/log-severity.enum';
import { LogScope } from '../shared/enums/log-scope.enum';

@Entity()
export class Log {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)" 
    })
    public createdAt: Date;

    @Column({
        nullable: true
    })
    method: string;

    @Column()
    message: string;

    @Column({
        nullable: true
    })
    data: string;

    @Column({
        nullable: true
    })
    scope: LogScope;

    @Column()
    level: LogSeverity;

    @Column({
        nullable: true
    })
    stack: string;

    toString(): string {
        const date = new Date();
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
        const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
        const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
        const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;
        const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const severity = LogSeverity[this.level];
        const scope = this.scope ? `(${LogScope[this.scope]}) ` : '';
        const method = this.method ? `Method ${this.method}` : '';
        const data = this.data ? `: ${this.data}` : '';
        return `[${severity} ${dateString}] ${scope}${method}: ${this.message}\n${data}\n`;
    }

    toHtmlString(data: object): string {
        const severity = LogSeverity[this.level];
        const method = this.method ? ` at ${this.method}` : '';
        let stack = this.stack.replace(/(?:\r\n|\r|\n)/g, '<br>');
        return `
        <br>
        <h3>${severity}${method}</h3>
        <p style="font-size: 1.2em; font-family: consolas, monospace;">
            ${this.message}
        </p>
        <pre>${JSON.stringify(data, undefined, 2)}</pre>
        <h4>Stack</h4>
        <p style="font-size: 1.0em; font-family: consolas, monospace;">
        ${stack}</p>
        `
    }
}
