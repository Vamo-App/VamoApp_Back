import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Client } from '../client/client.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Weight {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    weight: number;

    @ManyToOne(type => Client, client => client.weights)
    client: Client;

    @ManyToOne(type => Tag, tag => tag.weights)
    tag: Tag;
}
