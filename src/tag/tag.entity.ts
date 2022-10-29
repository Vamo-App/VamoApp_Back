import { Entity, PrimaryColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Weight } from '../weight/weight.entity';
import { Place } from '../place/place.entity';
import { Mission } from '../mission/mission.entity';

@Entity()
export class Tag {
    @PrimaryColumn()
    tag: string;

    @OneToMany(type => Weight, weight => weight.tag)
    weights: Weight[];

    @ManyToMany(type => Place, place => place.tags)
    @JoinTable()
    places: Place[];

    @OneToMany(type => Mission, mission => mission.tag)
    tagMissions: Mission[];
}
