import { Entity, PrimaryColumn, OneToMany, Column } from 'typeorm';
import { Client } from '../client/client.entity';
import { BaseEntity } from '../shared/utils/base';

@Entity()
export class Rank extends BaseEntity {
    @PrimaryColumn()
    name: string;

    @Column() // is unique but due to query builder, must manage it manually
    level: number;

    @Column()
    xpNext: number;
    
    @OneToMany(type => Client, client => client.rank)
    clients: Client[];
}