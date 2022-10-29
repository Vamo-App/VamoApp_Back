import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MediaType } from '../shared/enums/media-type.enum';
import { Place } from '../place/place.entity';
import { Event } from '../event/event.entity';

@Entity()
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    url: string;

    @Column()
    type: MediaType;

    @ManyToOne(type => Event, event => event.medias, {
        onDelete: 'CASCADE'
    })
    event: Event;

    @ManyToOne(type => Place, place => place.medias, {
        onDelete: 'CASCADE'
    })
    place: Place;
}