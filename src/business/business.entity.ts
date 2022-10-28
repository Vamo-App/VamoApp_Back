import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Place } from '../place/place.entity';

@Entity()
export class Business {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    type: string;

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

    @Column()
    picture: string;
    
    @OneToMany(type => Place, place => place.business)
    places: Place[];
}