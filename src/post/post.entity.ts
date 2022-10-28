import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Client } from '../client/client.entity';
import { Place } from '../place/place.entity';

@Entity()
export class Post {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    description: string;

    @Column()
    picture: string;

    @Column()
    visible: boolean;

    @ManyToOne(type => Client, client => client.posts)
    client: Client;

    @ManyToOne(type => Place, place => place.posts)
    place: Place;
}