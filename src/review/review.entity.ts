import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //TODO D

    @ManyToOne(type => Client, client => client.reviews)
    client: Client;
}