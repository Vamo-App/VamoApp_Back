import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, ManyToOne } from 'typeorm';
import { Client } from '../client/client.entity';
import { Review } from '../review/review.entity';
import { Post } from '../post/post.entity';
import { Business } from '../business/business.entity';
import { Tag } from '../tag/tag.entity';
import { Mission } from '../mission/mission.entity';
import { Media } from '../media/media.entity';
import { Event } from '../event/event.entity';

@Entity()
export class Place {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string;

    @Column({
        nullable: true
    })
    picture: string;

    @Column()
    country: string;

    @Column()
    state: string;

    @Column()
    city: string;

    @Column({
        nullable: true
    })
    neighborhood: string;

    @Column()
    address: string;
    
    @Column({ 
        type: "float"
    })
    latitude: number;

    @Column({ 
        type: "float"
    })
    longitude: number;

    @Column({
        nullable: true
    })
    phone: string;

    @Column({
        nullable: true
    })
    website: string;

    @Column({ 
        type: "float"
    })
    average: number;

    @Column({
        nullable: true
    })
    facebook: string;

    @Column({
        nullable: true
    })
    instagram: string;

    @Column({
        nullable: true
    })
    tiktok: string;

    @Column()
    prospect: boolean;

    @ManyToMany(type => Client, client => client.pending)
    clientsPending: Client[];

    @ManyToMany(type => Client, client => client.liked)
    clientsLiked: Client[];

    @OneToMany(type => Review, review => review.place)
    reviews: Review[];

    @OneToMany(type => Post, post => post.place)
    posts: Post[];

    @ManyToOne(type => Business, business => business.places)
    business: Business;

    @ManyToMany(type => Tag, tag => tag.places)
    tags: Tag[];

    @ManyToMany(type => Mission, mission => mission.places)
    placeMissions: Mission[];

    @OneToMany(type => Media, media => media.place)
    medias: Media[];

    @OneToMany(type => Event, event => event.place)
    events: Event[];
}