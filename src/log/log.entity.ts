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
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        const severity = LogSeverity[this.level];
        const scope = this.scope ? `(${LogScope[this.scope]}) ` : '';
        const method = this.method ? `Method ${this.method}` : '';
        const data = this.data ? `: ${this.data}` : '';
        return `[${severity} ${dateString}] ${scope}${method}: ${this.message}\n${data}`;
    }
}
