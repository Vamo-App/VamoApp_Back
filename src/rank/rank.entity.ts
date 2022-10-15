import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Rank {
    @PrimaryGeneratedColumn("uuid")
    id: string;
}