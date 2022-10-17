import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { Post } from '../post/post.entity';
import { Weight } from '../weight/weight.entity';
import { Tag } from '../tag/tag.entity';
import { Mission } from '../mission/mission.entity';
import { Place } from '../place/place.entity';
import { Review } from '../review/review.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { LocationClass } from '../shared/classes/location';

@Injectable()
export class ClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(Weight)
        private readonly weightRepository: Repository<Weight>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Mission)
        private readonly missionRepository: Repository<Mission>,
    ) {}

    async register(client: Client): Promise<Client> {

        for (const item in client) {
            if (['id', 'xp', 'rank', 'missions', 'posts', 'reviews', 'pending', 'liked'].findIndex(x => x === item) !== -1) {
                console.log(item);
                if (client[item] !== undefined)
                    throw new BusinessLogicException(`The field ${item} cannot be manually set`, HttpStatus.FORBIDDEN);
            }
        }

        //TODO T settear como instancias de misiones, todas las misiones que tengan base=true

        const clientFound = await this.clientRepository.findOne({ where: {email: client.email} });
        if (clientFound)
            throw new BusinessLogicException(`The client with the email (${client.email}) already exists`, HttpStatus.PRECONDITION_FAILED);

        const clientSaved: Client = await this.clientRepository.save(client)
        for (const weight of client.weights) {
            const tag = await this.tagRepository.findOne({ where: {tag: weight.tag.tag} });
            if (!tag) {
                console.log(tag);
                weight.tag = await this.tagRepository.save(weight.tag);
            }
        }
        // TODO T DEMASIADO DENSO ESTE ERROR, pero si borro las 4 líneas de abajo, funciona sin crear los weights
        for (const weight of clientSaved.weights) {
            weight.client = clientSaved;
            await this.weightRepository.save(weight);
        }

        return clientSaved;
    }

    async getAll(): Promise<Client[]> {
        return await this.clientRepository.find({ relations: ['rank', 'weights'] });
    }

    async getAllFiltered(q: string): Promise<Client[]> {
        //TODO T
        return this.getAll();
    }

    async getOne(clientId: string): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['rank'] });
        if (client === undefined)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        return client;
    }

    async update(clientId: string, client: Client): Promise<Client> {
        //TODO T
        return ;
    }

    async delete(clientId: string): Promise<void> {
        //TODO T
        return ;
    }

    async getReviews(clientId: string): Promise<Review[]> {
        //TODO T
        return ;
    }

    async getPendings(clientId: string): Promise<Place[]> {
        //TODO T
        return ;
    }

    async addPending(clientId: string, placeId: string): Promise<Place> {
        //TODO T
        return ;
    }

    async removePending(clientId: string, placeId: string): Promise<Place> {
        //TODO T
        return ;
    }

    async getLiked(clientId: string): Promise<Place[]> {
        //TODO T
        return ;
    }

    async addLiked(clientId: string): Promise<Place> {
        //TODO T
        return ;
    }

    async removeLiked(clientId: string, placeId: string): Promise<Place> {
        //TODO T
        return ;
    }

    async getPosts(clientId: string): Promise<Post[]> {
        //TODO T
        return ;
    }

     async publishPost(clientId: string, post:Post): Promise<Post> {
        //TODO T
        return ;
    }

    async removePost(clientId: string, postId: string): Promise<Post> {
        //TODO T
        return ;
    }

    async getMissions(clientId: string): Promise<MissionClient[]> {
        //TODOO O
        return ;
    }

    async reportLocationToAccomplishMissions(clientId: string, location:LocationClass): Promise<MissionClient[]> {
        //TODO O
        return ;
    }
}
