import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Client } from '../client/client.entity';

@Injectable()
export class MissionService {
    constructor(
        @InjectRepository(Mission)
        private readonly repository: Repository<Mission>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    async getAll(): Promise<Mission[]> {
        return await this.repository.find();
    }

    async create(mission: Mission): Promise<Mission> {
        const clients: Client[] = await this.clientRepository.find();

        const missionCreated = await this.repository.save(mission);

        clients.forEach(async client => {
            const missionClient = new MissionClient();
            missionClient.client = client;
            missionClient.mission = missionCreated;
            missionClient.percentage = 0.0;
            await this.missionClientRepository.save(missionClient);
        });

        return missionCreated;
    }

    async update(missionId: string, mission: Mission): Promise<Mission> {
        const missionToUpdate = await this.repository.findOne({ where: {id:missionId} });
        if (!missionToUpdate) {
            throw new BusinessLogicException(`The mission with the id ${missionId} was not found`, HttpStatus.NOT_FOUND);
        }
        return await this.repository.save(mission);
    }
}
