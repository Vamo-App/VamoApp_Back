import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //TODO D
    
    @ManyToOne(type => Client, client => client.posts)
    client: Client;
}