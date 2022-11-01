import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Mission } from './mission.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Client } from '../client/client.entity';
import { MissionType } from '../shared/enums/mission-type.enum';
import { Place } from '../place/place.entity';

@Injectable()
export class MissionService {
    constructor(
        @InjectRepository(Mission)
        private readonly repository: Repository<Mission>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>
    ) {}

    async getAll(): Promise<Mission[]> {
        return await this.repository.find();
    }

    async create(mission: Mission): Promise<Mission> {
        const clients: Client[] = await this.clientRepository.find();

        if (mission.places && mission.places.length && mission.tag)
            throw new BusinessLogicException(`A mission can't have both a tag and places`, HttpStatus.BAD_REQUEST);

        if (mission.places) {
            const realPlaces: Place[] = [];
            for (const place of mission.places) {
                const realPlace = await this.placeRepository.findOne({ where: {id:place.id} });
                if (!realPlace)
                    throw new BusinessLogicException(`The place with id (${place.id}) was not found`, HttpStatus.NOT_FOUND);
                realPlaces.push(realPlace);
            }
            mission.places = realPlaces;
        }

        if (mission.type === MissionType.VISIT && (!(mission.places && mission.places.length) && !mission.tag))
            throw new BusinessLogicException(`A VISIT mission must have a tag or at least one place`, HttpStatus.BAD_REQUEST);

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
