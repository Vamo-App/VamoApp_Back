import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Place {
    @PrimaryGeneratedColumn("uuid")
    id: string;
}