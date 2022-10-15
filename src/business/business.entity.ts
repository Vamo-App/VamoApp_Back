import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Business {
    @PrimaryGeneratedColumn("uuid")
    id: string;
}