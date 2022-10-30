import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionClient } from '../mission-client/mission-client.entity';

@Injectable()
export class MissionService {
    constructor(
        @InjectRepository(Mission)
        private readonly repository: Repository<Mission>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
    ) {}

    async getAll(): Promise<Mission[]> {
        return await this.repository.find();
    }

    async create(mission: Mission): Promise<Mission> {
        return await this.repository.save(mission);
    }

    async update(missionId: string, mission: Mission): Promise<Mission> {
        const missionToUpdate = await this.repository.findOne({ where: {id:missionId} });
        if (!missionToUpdate) {
            throw new BusinessLogicException(`The mission with the id ${missionId} was not found`, HttpStatus.NOT_FOUND);
        }
        return await this.repository.save(mission);
    }
}
