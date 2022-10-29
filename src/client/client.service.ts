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
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
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

        //TODO T settear el rank al rango inicial, hacer esto cuando ya estén hechas las migraciones
        //TODO T settear como instancias de misiones, todas las misiones que tengan base=true

        for (const weight of client.weights) {
            const tag = await this.tagRepository.findOne({ where: {tag: weight.tag.tag} });
            if (!tag) 
                weight.tag = await this.tagRepository.save(weight.tag);
            await this.weightRepository.save(weight);
        }

        return await this.clientRepository.save(client);
    }

    async getAll(q: string): Promise<Client[]> {
        let clients = await this.clientRepository.find({ relations: ['rank', 'weights'] });
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
        return client.reviews;
    }

    async getPendings(clientId: string): Promise<Place[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        return client.pending;
    }

    async addPending(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.pending.push(place);
        await this.clientRepository.save(client);
        return place;
    }

    async removePending(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['pending'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.pending = client.pending.filter(p => p.id !== place.id);
        await this.clientRepository.save(client);
        return place;
    }

    async getLiked(clientId: string): Promise<Place[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        return client.liked;
    }

    async addLiked(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.liked.push(place);
        await this.clientRepository.save(client);
        return place;
    }

    async removeLiked(clientId: string, placeId: string): Promise<Place> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['liked'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${placeId}) was not found`, HttpStatus.NOT_FOUND);
        client.liked = client.liked.filter(p => p.id !== place.id);
        await this.clientRepository.save(client);
        return place;
    }

    async getPosts(clientId: string): Promise<Post[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        return client.posts;
    }

     async publishPost(clientId: string, post:Post): Promise<Post> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        post.client = client;
        const newPost = await this.postRepository.save(post);
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
        return client.missions;
    }

    async reportLocationToAccomplishMissions(clientId: string, location:LocationClass): Promise<MissionClient[]> {
        //TODO O
        return ;
    }
}
