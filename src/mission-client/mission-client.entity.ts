import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';
import { Mission } from '../mission/mission.entity';

@Entity()
export class MissionClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ 
        type: "float"
    })
    percentage: number;
    
    @ManyToOne(type => Client, client => client.missions)
    client: Client;

    @ManyToOne(type => Mission, mission => mission.instances)
    mission: Mission;
}