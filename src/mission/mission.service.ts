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
import { Tag } from '../tag/tag.entity';
import { LogService } from '../log/log.service';
import { LogScope } from '../shared/enums/log-scope.enum';

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
        private readonly placeRepository: Repository<Place>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        private readonly log: LogService
    ) {}

    async getAll(): Promise<Mission[]> {
        return await this.repository.find();
    }

    async create(mission: Mission): Promise<Mission> {
        const clients: Client[] = await this.clientRepository.find();

        if (mission.places && mission.places.length && mission.tag)
            throw new BusinessLogicException(`A mission can't have both a tag and places`, HttpStatus.BAD_REQUEST);

        if (mission.tag) {
            let tag: Tag = await this.tagRepository.findOne({ where: { tag: mission.tag.tag } });
            if (!tag)
                tag = await this.tagRepository.save(mission.tag);
            mission.tag = tag;
        }

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

    async delete(missionId: string): Promise<void> {
        const mission = await this.repository.findOne({ where: {id:missionId} });
        if (!mission)
            throw new BusinessLogicException(`The mission with the id ${missionId} was not found`, HttpStatus.NOT_FOUND);
        const clients: Client[] = await this.clientRepository.find({ relations: ['missions', 'missions.mission'] });
        let countDeleted: number = 0;
        for (const client of clients) {
            for (const missionClient of client.missions) {
                if (missionClient.mission.id === missionId) {
                    if (missionClient.percentage >= 1.0) {
                        this.log.info(`The missionClient with id (${missionClient.id}) couldn't be deleted because it was completed by the client with id (${client.id})`, 'Delete mission', null, LogScope.ADMIN);
                        countDeleted = -Infinity;
                    } else {
                        countDeleted++;
                        await this.missionClientRepository.delete(missionClient.id);
                    }
                }
            }
        }
        if (countDeleted === -Infinity) {
            if (mission.base) {
                mission.base = false;
                await this.repository.save(mission);
                throw new BusinessLogicException(`The mission with the id (${missionId}) couldn't be deleted because it was completed by at least one client, instead 'base was set to false' (all the instances not completed were deleted)`, HttpStatus.PRECONDITION_FAILED);
            }
            throw new BusinessLogicException(`The mission with the id (${missionId}) couldn't be deleted because it was completed by at least one client (all the instances not completed were deleted)`, HttpStatus.PRECONDITION_FAILED);
        }
        await this.repository.delete(missionId);
        throw new BusinessLogicException(`The mission with the id (${missionId}) was deleted, ${countDeleted} uncomplete instances were deleted`, HttpStatus.OK);
    }
}
