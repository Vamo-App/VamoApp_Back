import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Place } from '../place/place.entity';
import { Media } from '../media/media.entity';
import { BaseEntity } from '../shared/utils/base';

@Entity()
export class Event extends BaseEntity {
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

    @Column({
        nullable: true
    })
    url: string;

    @ManyToOne(type => Place, place => place.events, {
        onDelete: 'CASCADE'
    })
    place: Place;

    @OneToMany(type => Media, media => media.event)
    media: Media[];
}
