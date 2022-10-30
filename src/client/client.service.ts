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
import { Rank } from '../rank/rank.entity';
import { LocationClass } from '../shared/utils/location';
import { entitiesConstants } from '../shared/utils/constants';
import { MissionType } from '../shared/enums/mission-type.enum';

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
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
        @InjectRepository(Rank)
        private readonly rankRepository: Repository<Rank>,
    ) {}

    async register(client: Client): Promise<Client> {
        const clientFound = await this.clientRepository.findOne({ where: {email: client.email} });
        if (clientFound)
            throw new BusinessLogicException(`The client with the email (${client.email}) already exists`, HttpStatus.PRECONDITION_FAILED);

        for (const item in client) {
            if (['id', 'xp', 'rank', 'missions', 'posts', 'reviews', 'pending', 'liked'].findIndex(x => x === item) !== -1) {
                if (client[item])
                    throw new BusinessLogicException(`The field ${item} cannot be manually set`, HttpStatus.FORBIDDEN);
            }
        }

        // settear el rango 0 por defecto, si no existe, crearlo
        let rank = await this.rankRepository.findOne({ where: { level:0 } });
        if (!rank) {
            rank = entitiesConstants.DEFAULT_RANK;
            await this.rankRepository.save(rank);
        }
        client.rank = rank;

        // settear como instancias de misiones (0% completado), todas las misiones que tengan base=true
        const missionsFound = await this.missionRepository.find({ where: { base: true } });
        client.missions = [];
        for (const mission of missionsFound) {
            let missionClient: MissionClient = new MissionClient();
            missionClient.percentage = 0.0;
            missionClient.mission = mission;
            missionClient = await this.missionClientRepository.save(missionClient);
            client.missions.push(missionClient);
        }

        // crear todos los pesos que se hayan indicado (peso de 100%) y si no existen los tags, crearlos también
        for (const weight of client.weights) {
            const tag = await this.tagRepository.findOne({ where: {tag: weight.tag.tag} });
            if (!tag) 
                weight.tag = await this.tagRepository.save(weight.tag);
            await this.weightRepository.save(weight);
        }

        return await this.clientRepository.save(client);
    }

    async getAll(q: string): Promise<Client[]> {
        let clients = await this.clientRepository.find({ relations: ['rank'] });
        if (q)
            clients = clients.filter(client => client.name.toLowerCase().includes(q.toLowerCase()));
        if (!clients.length)
            throw new BusinessLogicException(`No clients were found`, HttpStatus.NO_CONTENT);
        return clients;
    }

    async getOne(clientId: string): Promise<Client> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['rank'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        return client;
    }

    async update(clientId: string, client: Client): Promise<Client> {
        const clientToUpdate = await this.clientRepository.findOne({ where: {id: clientId} });
        if (!clientToUpdate)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);

        if (client.email && client.email !== clientToUpdate.email) {
            const clientFound = await this.clientRepository.findOne({ where: {email: client.email} });
            if (clientFound)
                throw new BusinessLogicException(`The client with the email (${client.email}) already exists`, HttpStatus.PRECONDITION_FAILED);
        }

        for (const item in client) {
            if (['id', 'xp', 'rank', 'missions', 'posts', 'reviews', 'pending', 'liked'].findIndex(x => x === item) !== -1)
                if (client[item])
                    throw new BusinessLogicException(`The field ${item} cannot be manually modified`, HttpStatus.FORBIDDEN);
        }
        return await this.clientRepository.save({...clientToUpdate, ...client});
    }

    async delete(clientId: string): Promise<void> {
        const client = await this.clientRepository.findOne({ where: {id: clientId} });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        await this.clientRepository.remove(client);
    }

    async getReviews(clientId: string): Promise<Review[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['reviews'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.reviews.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no reviews`, HttpStatus.NO_CONTENT);
        return client.reviews;
    }

    async getPendings(clientId: string): Promise<Place[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.pending.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no pending places`, HttpStatus.NO_CONTENT);
        return client.pending;
    }

    async addPending(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending', 'weights'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.pending.push(place);

        // TODO B actualizar los pesos del cliente

        await this.clientRepository.save(client);
        return place;
    }

    async removePending(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending', 'weights'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.pending = client.pending.filter(p => p.id !== place.id);

        // TODO B actualizar los pesos del cliente

        await this.clientRepository.save(client);
        return place;
    }

    async getLiked(clientId: string): Promise<Place[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.liked.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no liked places`, HttpStatus.NO_CONTENT);
        return client.liked;
    }

    async addLiked(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked', 'weights'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.liked.push(place);

        // TODO B actualizar los pesos del cliente

        await this.clientRepository.save(client);
        return place;
    }

    async removeLiked(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked', 'weights'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.liked = client.liked.filter(p => p.id !== place.id);

        // TODO B actualizar los pesos del cliente

        await this.clientRepository.save(client);
        return place;
    }

    async getPosts(clientId: string): Promise<Post[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.posts.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no posts`, HttpStatus.NO_CONTENT);
        return client.posts;
    }

     async publishPost(clientId: string, post:Post): Promise<Post> {
        const client: Client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts', 'missions', 'weights', 'rank'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: post.place.id} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${post.place.id}) was not found`, HttpStatus.NOT_FOUND);
        post.client = client;
        post.place = place;
        const newPost = await this.postRepository.save(post);

        // TODO T actualizar el % de las instancias de misiones del cliente, si es el 100%, se le suma el XP al usuario y si tiene suficiente XP para subir de rango, se actualiza el rango

        return newPost;
    }

    async removePost(clientId: string, postId: string): Promise<Post> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const post = await this.postRepository.findOne({ where: {id: postId} });
        if (!post)
            throw new BusinessLogicException(`The post with the id (${postId}) was not found`, HttpStatus.NOT_FOUND);
        const postIndex = client.posts.findIndex(p => p.id === post.id);
        if (postIndex === -1)
            throw new BusinessLogicException(`The post with the id (${postId}) is not owned by the client with the id (${clientId})`, HttpStatus.NOT_FOUND);
        client.posts.splice(postIndex, 1);
        await this.clientRepository.save(client);
        await this.postRepository.delete(post.id);
        return post;
    }

    async getMissions(clientId: string): Promise<MissionClient[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['missions'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.missions.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no missions`, HttpStatus.NO_CONTENT);
        return client.missions;
    }

    async reportLocationToAccomplishMissions(clientId: string, location:LocationClass): Promise<MissionClient[]> {
        //TODO B
        return ;
    }
}
