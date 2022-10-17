import { Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Place {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    //TODO B

    @ManyToMany(type => Client, client => client.pending)
    clientsPending: Client[];

    @ManyToMany(type => Client, client => client.liked)
    clientsLiked: Client[];
}