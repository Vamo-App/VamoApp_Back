import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MissionClient {
    @PrimaryGeneratedColumn("uuid")
    id: string;
}