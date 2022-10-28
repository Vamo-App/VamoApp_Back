import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { MissionType } from '../shared/enums/mission-type.enum';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Place } from '../place/place.entity';
import { Tag } from '../tag/tag.entity';

@Entity()
export class Mission {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    prizeXp: number;

    @Column()
    type: MissionType;

    @Column()
    requiredN: number;

    @Column()
    base: boolean;

    @OneToMany(type => MissionClient, missionClient => missionClient.mission)
    instances: MissionClient[];

    @ManyToMany(type => Place, place => place.placeMissions)
    places: Place[];

    @ManyToOne(type => Tag, tag => tag.tagMissions)
    tag: Tag;
}