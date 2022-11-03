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
import { LocationDto } from '../shared/utils/location';
import { entitiesConstants } from '../shared/utils/constants';
import { MissionType } from '../shared/enums/mission-type.enum';
import { LogService } from '../log/log.service';
import { planeText, distance, getStackTrace } from '../shared/utils/functions';

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
        private readonly log: LogService
    ) {}

    async register(client: Client): Promise<Client> {
        const clientFound = await this.clientRepository.findOne({ where: {email: client.email} });
        if (clientFound)
            throw new BusinessLogicException(`The client with the email (${client.email}) already exists`, HttpStatus.BAD_REQUEST);

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

    async getAll(q: string, eachWord: boolean): Promise<Client[]> {
        let clients = await this.clientRepository.find({ relations: ['rank'] });

        if (q) {
            const qL: string[] = eachWord ? planeText(q).split(' ') : [planeText(q)];

            let i: number = 0;
            while (i < clients.length) {
                // busca si el nombre contiene la palabra buscada
                const clientName = planeText(clients[i].name);

                if (qL.some(v => clientName.includes(v)))
                    i++;
                else
                    clients.splice(i, 1);
            }
        }

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
                throw new BusinessLogicException(`The client with the email (${client.email}) already exists`, HttpStatus.BAD_REQUEST);
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
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['reviews', 'reviews.place'] });
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
        const client: Client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.posts.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no posts`, HttpStatus.NO_CONTENT);
        return client.posts;
    }

     async publishPost(clientId: string, post:Post): Promise<Post> {
        const client: Client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['rank', 'missions', 'missions.mission', 'missions.mission.places', 'missions.mission.tag'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        const place = await this.placeRepository.findOne({ where: {id: post.place.id}, relations: ['tags'] });
        if (!place)
            throw new BusinessLogicException(`The place with the id (${post.place.id}) was not found`, HttpStatus.NOT_FOUND);
        post.client = client;
        post.place = place;
        const newPost = await this.postRepository.save(post);

        client.missions.forEach(async mission => {
            if (mission.percentage < 1.0 && mission.mission.type === MissionType.POST) {
                // si requiere que sea en algún lugar en específico, se verifica que sí sea el lugar, si no es, no se suma nada
                if (mission.mission.places.length && !mission.mission.places.find(p => p.id === post.place.id)) {
                    return ;
                }

                // si requiere que sea en algún tag en específico, se verifica que sí sea el tag, si no es, no se suma nada
                if (mission.mission.tag && !post.place.tags.find(t => t.tag === mission.mission.tag.tag)) {
                    return ;
                }

                // si requiredN = 5 (se deben subir 5 posts), se suma 1/5 que es el 20% al porcentaje de la misión
                mission.percentage += 1/mission.mission.requiredN;

                if (mission.percentage > 0.99)
                    mission.percentage = 1.0; // se aproxima

                // si se cumplió la misión (100%) se le suma el XP al usuario 
                if (mission.percentage >= 1.0) {
                    mission.percentage = 1.0
                    client.xp += mission.mission.prizeXp;
                    if (client.xp >= client.rank.xpNext) {
                        // si el XP del usuario es mayor o igual al XP necesario para subir de rango, se actualiza el rango
                        client.xp -= client.rank.xpNext;
                        const rankFound = await this.rankRepository.findOne({ where: {level: client.rank.level + 1} });
                        if (!rankFound) {
                            const error = new BusinessLogicException(`The rank with the level (${client.rank.level + 1}) was not found`, HttpStatus.NOT_FOUND);
                            this.log.error(`Client ${client.id} has reached the maximum current rank (${client.rank.name}), or it's needed to create a next rank`, error, getStackTrace(), 'Publish Post');
                            // no se lanza el error, ya que realmente no es un error del método, simplemente el usuario ya llegó al máximo rango actual
                        }
                        else {
                            client.rank = rankFound;
                        }
                    }
                }

                await this.missionClientRepository.save(mission);
            }
        });
        const clientUpdated = await this.clientRepository.save(client); // actualizar cliente

        newPost.client = clientUpdated;
        return newPost;
    }

    async updatePost(clientId: string, postId: string, post:Post): Promise<Post> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['posts'] });
        if (!client)
            throw new BusinessLogicException(`Client with id ${clientId} was not found`, HttpStatus.NOT_FOUND);
        
        const postFound = await this.postRepository.findOne({ where: {id: postId} });
        if (!postFound)
            throw new BusinessLogicException(`Post with id ${postId} was not found`, HttpStatus.NOT_FOUND);

        const postIndex = client.posts.findIndex(p => p.id === postFound.id);
        if (postIndex === -1)
            throw new BusinessLogicException(`Post with id ${postId} is not associated with client with id ${clientId}`, HttpStatus.BAD_REQUEST);

        const postUpdated = await this.postRepository.save({ ...postFound, ...post });
        return postUpdated;
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

    async getMissions(clientId: string): Promise<any[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['missions'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        if (!client.missions.length)
            throw new BusinessLogicException(`The client with the id (${clientId}) has no missions`, HttpStatus.NO_CONTENT);
        
        const missions: any = { 'complete': [], 'incomplete': [] };
        client.missions.forEach(mission => {
            if (mission.percentage >= 1.0)
                missions.complete.push(mission);
            else
                missions.incomplete.push(mission);
        });

        return missions;
    }

    async reportLocationToAccomplishMissions(clientId: string, location:LocationDto): Promise<MissionClient[]> {
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['rank', 'missions', 'missions.mission', 'missions.mission.places', 'missions.mission.tag'] });
        if (!client)
            throw new BusinessLogicException(`The client with the id (${clientId}) was not found`, HttpStatus.NOT_FOUND);
        
        // encuentra todos los lugares que se encuentran en el radio de la locación dada
        const allPlaces = await this.placeRepository.find({ relations: ['tags'] });
        const places = allPlaces.filter(place => {
            const dist = distance(location.latitude, location.longitude, place.latitude, place.longitude);
            return dist <= place.radius;
        });

        // si no hay lugares en el radio, no se hace nada
        if (!places.length)
            throw new BusinessLogicException(`There are no places near to the given location`, HttpStatus.NO_CONTENT);
        
        const missionsAccomplished = [];
        client.missions.forEach(async mission => {
            if (mission.percentage < 1.0 && mission.mission.type === MissionType.VISIT) {
                // si requiere que sea en algún lugar en específico, se verifica que sí sea el lugar, si no es, no se suma nada
                // o si se requiere que el lugar tenga algún tag en específico, se verifica que sí lo tenga, si no es, no se suma nada
                if (!(mission.mission.places && mission.mission.places.length) && !mission.mission.tag) {
                    this.log.warn(`The visit mission with the id (${mission.mission.id}) has no places or tag`, mission.mission, 'Report Location To Accomplish Missions');
                    return ;
                }

                if (mission.mission.places.length && !mission.mission.places.find(p => places.find(place => place.id === p.id))) {
                    return ;
                }

                // si requiere que sea en algún tag en específico, se verifica que sí sea el tag, si no es, no se suma nada
                if (mission.mission.tag && !places.find(place => place.tags.find(t => t.tag === mission.mission.tag.tag))) {
                    return ;
                }

                // EJ: si requiredN = 5 (se deben visitar 5 lugares), se suma 1/5 que es el 20% al porcentaje de la misión
                mission.percentage += 1/mission.mission.requiredN;

                if (mission.percentage > 0.99)
                    mission.percentage = 1.0; // se aproxima

                // si se cumplió la misión (100%) se le suma el XP al usuario 
                if (mission.percentage >= 1.0) {
                    mission.percentage = 1.0
                    client.xp += mission.mission.prizeXp;
                    if (client.xp >= client.rank.xpNext) {
                        // si el XP del usuario es mayor o igual al XP necesario para subir de rango, se actualiza el rango
                        client.xp -= client.rank.xpNext;
                        const rankFound = await this.rankRepository.findOne({ where: {level: client.rank.level + 1} });
                        if (!rankFound) {
                            const error = new BusinessLogicException(`The rank with the level (${client.rank.level + 1}) was not found`, HttpStatus.NOT_FOUND);
                            this.log.error(`Client ${client.id} has reached the maximum current rank (${client.rank.name}), or it's needed to create a next rank`, error, getStackTrace(), 'Report Location');
                            // no se lanza el error, ya que realmente no es un error del método, simplemente el usuario ya llegó al máximo rango actual
                        }
                        else {
                            client.rank = rankFound;
                        }
                    }
                }

                await this.missionClientRepository.save(mission);
                missionsAccomplished.push(mission);
            }
        });
        await this.clientRepository.save(client); // actualizar cliente

        if (!missionsAccomplished.length)
            throw new BusinessLogicException(`There are no missions accomplished`, HttpStatus.NO_CONTENT);

        return missionsAccomplished;
    }
}
