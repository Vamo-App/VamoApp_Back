import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Weight {
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
