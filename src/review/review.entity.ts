import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';
import { Place } from '../place/place.entity';

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: true
    })
    text: string;

    @Column({ 
        type: "float"
    })
    stars: number;

    @ManyToOne(type => Client, client => client.reviews, {
        onDelete: 'CASCADE'
    })
    client: Client;

    @ManyToOne(type => Place, place => place.reviews, {
        onDelete: 'CASCADE'
    })
    place: Place;
}