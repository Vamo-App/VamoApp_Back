import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';
import { Place } from '../place/place.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    text: string;

    @Column({ 
        type: "float"
    })
    stars: number;

    @ManyToOne(type => Client, client => client.reviews)
    client: Client;

    @ManyToOne(type => Place, place => place.reviews)
    place: Place;
}