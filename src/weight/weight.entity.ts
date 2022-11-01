import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Tag } from '../tag/tag.entity';
import { BaseEntity } from '../shared/utils/base';

@Entity()
export class Weight extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ 
        type: "float"
    })
    weight: number;

    @ManyToOne(type => Client, client => client.weights, {
        onDelete: 'CASCADE'
    })
    client: Client;

    @ManyToOne(type => Tag, tag => tag.weights, {
        onDelete: 'CASCADE'
    })
    tag: Tag;
}
