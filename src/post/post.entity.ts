import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Client } from '../client/client.entity';
import { Place } from '../place/place.entity';
import { BaseEntity } from '../shared/utils/base';

@Entity()
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column()
    picture: string;

    @Column({
        default: true
    })
    visible: boolean;

    @ManyToOne(type => Client, client => client.posts, {
        onDelete: 'CASCADE'
    })
    client: Client;

    @ManyToOne(type => Place, place => place.posts, {
        onDelete: 'CASCADE' // TODO ? Si se borra un lugar, se deberían borrar todos los posts de ese lugar?
    })
    place: Place;
}