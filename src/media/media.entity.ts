import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Media {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //TODO O
}