import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mission {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    //TODO D
}