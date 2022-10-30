import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Rank {
    @PrimaryColumn()
    name: string;

    @Column() // is unique but due to query builder, must manage it manually
    level: number;

    @Column()
    xpNext: number;
    
    @OneToMany(type => Client, client => client.rank)
    clients: Client[];
}