import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';

@Entity()
export class MissionClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //TODO D
    
    @ManyToOne(type => Client, client => client.missions)
    client: Client;
}