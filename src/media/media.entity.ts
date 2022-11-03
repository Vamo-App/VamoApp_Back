import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { MediaType } from '../shared/enums/media-type.enum';
import { Place } from '../place/place.entity';
import { Event } from '../event/event.entity';
import { BaseEntity } from '../shared/utils/base';

@Entity()
export class Media extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    url: string;

    @Column()
    type: MediaType;

    @ManyToOne(type => Event, event => event.media, {
        onDelete: 'CASCADE'
    })
    event: Event;

    @ManyToOne(type => Place, place => place.media, {
        onDelete: 'CASCADE'
    })
    place: Place;
}