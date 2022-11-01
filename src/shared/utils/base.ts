import { Column, CreateDateColumn,UpdateDateColumn } from "typeorm";
import { Exclude } from 'class-transformer';

export class BaseEntity {
    @Exclude({ 
        toPlainOnly: true
    })
    @CreateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)" 
    })
    public createdAt: Date;

    @Exclude({
        toPlainOnly: true
    })
    @UpdateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)", 
        onUpdate: "CURRENT_TIMESTAMP(6)"
    })
    public updatedAt: Date;
}
