import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Rank } from '../rank/rank.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Weight } from '../weight/weight.entity';
import { Post } from '../post/post.entity';
import { Review } from '../review/review.entity';
import { Place} from '../place/place.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Client {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        unique: true
    })
    email: string;
    
    @Column()
    name: string;

    @Exclude({ 
        toPlainOnly: true 
    })
    @Column()
    password: string;

    @Column({
        nullable: true
    })
    picture: string;

    @Column({
        nullable: true
    })
    description: string;

    @Column({
        default: 0
    })
    xp: number;

    @ManyToOne(type => Rank, rank => rank.clients)
    rank: Rank;

    @OneToMany(type => MissionClient, mission => mission.client)
    missions: MissionClient[];

    @OneToMany(type => Weight, weight => weight.client)
    weights: Weight[];

    @OneToMany(type => Post, post => post.client)
    posts: Post[];

    @OneToMany(type => Review, review => review.client)
    reviews: Review[];

    @ManyToMany(type => Place, place => place.clientsPending)
    @JoinTable()
    pending: Place[];
    
    @ManyToMany(type => Place, place => place.clientsLiked)
    @JoinTable()
    liked: Place[];
}
