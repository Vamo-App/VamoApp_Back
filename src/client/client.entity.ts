import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, ManyToMany } from 'typeorm';
/*import { Rank } from '../rank/rank.entity';
import { MissionClient } from '../mission-client/mission-client.entity';*/
import { Weight } from '../weight/weight.entity';
/*import { Publication } from '../publication/publication.entity';
import { Review } from '../review/review.entity';
import { Place} from '../place/place.entity';*/

@Entity()
export class Client {
    @PrimaryColumn()
    email: string;
    
    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    picture: string;

    @Column()
    description: string;

    @Column()
    xp: number;

    /*@ManyToOne(type => Rank, rank => rank.clients)
    rank: Rank;

    @OneToMany(type => MissionClient, mission => mission.client)
    missions: MissionClient[];*/

    @OneToMany(type => Weight, weight => weight.client)
    weights: Weight[];

    /*@OneToMany(type => Publication, publication => publication.client)
    publications: Publication[];

    @ManyToOne(type => Review, review => review.client)
    reviews: Review[];

    @ManyToMany(type => Place, place => place.clientsPending)
    pending: Place[];
    
    @ManyToMany(type => Place, place => place.clientsLiked)
    liked: Place[];*/
}
