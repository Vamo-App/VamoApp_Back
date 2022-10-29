import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Place } from '../place/place.entity';
import { Media } from '../media/media.entity';

@Entity()
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    type: string;

    @Column()
    startDate: Date;

    @Column()
    endDate: Date;

    @Column()
    url: string;

    @ManyToOne(type => Place, place => place.events, {
        onDelete: 'CASCADE'
    })
    place: Place;

    @OneToMany(type => Media, media => media.event)
    medias: Media[];
}
