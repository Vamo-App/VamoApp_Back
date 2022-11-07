import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Place } from './place.entity';
import { Tag } from '../tag/tag.entity';
import { Client } from '../client/client.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { Rank } from '../rank/rank.entity';
import { Business } from '../business/business.entity';
import { Review } from '../review/review.entity';
import { Post } from '../post/post.entity';
import { Event } from '../event/event.entity';
import { Media } from '../media/media.entity';
import { RequestInfo, RequestInit } from 'node-fetch';
import { MissionType } from '../shared/enums/mission-type.enum';
import { minimumRadius } from '../shared/utils/constants';
import { LogService } from '../log/log.service';
import { getStackTrace, planeText } from '../shared/utils/functions';

const fetch = (url: RequestInfo, init?: RequestInit) =>
  import('node-fetch').then(({ default: fetch }) => fetch(url, init));

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
        @InjectRepository(MissionClient)
        private readonly missionClientRepository: Repository<MissionClient>,
        @InjectRepository(Rank)
        private readonly rankRepository: Repository<Rank> ,
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>,
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
        private readonly log: LogService
    ) {}

    async createProspect(place: Place): Promise<Place> {
        // TODO T
        return ;
    }

    async validateProspect(placeId: string, validate: boolean): Promise<Place> {
        // TODO T
        return ;
    }

    async getAll(q: string, clientId: string, eachWord: boolean): Promise<Place[]> {
        let places = await this.placeRepository.find({ relations: ['tags', 'business'] });

        if (q) {
            // cambios en el query para que quede lo mejor posible
            const qL: string[] = eachWord ? planeText(q).split(' ') : [planeText(q)];

            let i: number = 0;
            while (i < places.length) {
                let j: number = 0;
                // busca si alguno de los tags del lugar contiene la palabra buscada
                while (j < places[i].tags.length) {
                    const tag = planeText(places[i].tags[j].tag);
                    if (qL.some((v: string) => tag.includes(v))) {
                        break;
                    } else {
                        j++;
                    }
                }
                if (j === places[i].tags.length) {
                    const placeName = planeText(places[i].name);
                    const businessName = places[i].business ? planeText(places[i].business.name) : '';
                    // busca si el nombre del lugar o del negocio contiene la palabra buscada
                    if (qL.some(v => placeName.includes(v)) || qL.some(v => businessName.includes(v))) {
                        i++;
                    } else {
                        places.splice(i, 1);
                    }
                } else {
                    i++;
                }
            }
        }

        if (!places.length)
            throw new BusinessLogicException(`No places were found`, HttpStatus.NO_CONTENT);
        return places;
    }

    async getOne(placeId: string): Promise<Place> {
        const place = await this.placeRepository.findOne({ where: {id: placeId} ,relations: ['tags', 'business', 'media'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        return place;
    }

    async create(place: Place): Promise<Place> {
        // el negocio a asociar debe existir
        if (place.business) {
            const business = await this.businessRepository.findOne({ where: {id: place.business.id} });
            if (!business)
                throw new BusinessLogicException(`Business with id ${place.business.id} was not found`, HttpStatus.NOT_FOUND);
            place.business = business;
        }

        // IMPORTANTE: Si NO se envían como parámetro 'longitude' y 'latitude', se hace la solicitud a una API externa LIMITADA. Si se conocen estos dos datos, es mejor enviarlos como parámetro
        if (place.longitude || place.latitude) {
            if (!place.longitude || !place.latitude) {
                throw new BusinessLogicException(`The fields 'longitude' and 'latitude' must be sent together`, HttpStatus.BAD_REQUEST);
            }
            else {
                place.addressLabel = place.address;
                place.radius = minimumRadius + (place.radius || 0);
            }
        } else {
            let status: number;
            const fullAddress: string = `${place.address}, ${place.neighborhood ? (place.neighborhood + ', ') : ''}${place.city}, ${place.state}, ${place.country}`;
            const fetchUrl: string = 'http://api.positionstack.com/v1/forward?' + new URLSearchParams({
                access_key: process.env.POSITIONSTACK_API_KEY,
                query: fullAddress
            });
            this.log.info(`PositionStack API consumed at endpoint: \n'${fetchUrl}'`, 'Create Place');
            const response: any = await fetch(`${fetchUrl}`)
                    .then(res => {
                        status = res.status;
                        return res.json();
                    });
            if (status !== 200) {
                this.log.error(`Error status ${status} when calling PositionStack API`, response, getStackTrace(), 'Create Place');
                throw new BusinessLogicException(`Error in the request. Please try again and if the error persist, contact the admin.`, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            if (!response || !response.data || !response.data[0] || !response.data[0].latitude || !response.data[0].longitude) {
                this.log.warn(`The address '${fullAddress}' was not found by PositionStack API. Endpoint '${fetchUrl}'`, response, 'Create Place');
                throw new BusinessLogicException(`The address '${fullAddress}' was not found. Please try again and if the error persist, contact the admin.`, HttpStatus.NOT_FOUND);
            }
            
            let i: number = 0;
            if (response.data.length > 1) {
                i = -1;
                for (const item of response.data) {
                    if (item.country.toLowerCase() === place.country.toLowerCase()) {
                        i = response.data.indexOf(item);
                        break;
                    }
                }

                if (i === -1) {
                    this.log.warn(`More than one occurrences for '${fullAddress}' in PositionStack API, but any was found in the country`, response, 'Create Place');
                    throw new BusinessLogicException(`The address '${fullAddress}' was not found. Please try again and if the error persist, contact the admin.`, HttpStatus.NOT_FOUND);
                } else {
                    this.log.warn(`More than one occurrences for '${fullAddress}' in PositionStack API, but at least one found in the country`, response, 'Create Place');
                }
            }

            place.addressLabel = response.data[i].label || response.data[i].name || place.address;
            place.latitude = response.data[i].latitude;
            place.longitude = response.data[i].longitude;
            place.radius = minimumRadius/response.data[i].confidence + (place.radius || 0);
        }

        // si hay algun tag del lugar que no existe, se crea
        for (const tag of place.tags) {
            const tagFound = await this.tagRepository.findOne({ where: { tag: tag.tag } });
            if (!tagFound)
                await this.tagRepository.save(tag);
        }
        
        return this.placeRepository.save(place);
    }

    async update(placeId: string, place: Place): Promise<Place> {
        const placeFound = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!placeFound)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);

        // ya no se hace un llamado a la API externa, simplemente se modifican los atributos que se envíen, es decir se toma la latitud, longitud, dirección, etc. que se envíen
        if (place.longitude || place.latitude) {
            if (!place.longitude || !place.latitude)
                throw new BusinessLogicException(`The fields 'longitude' and 'latitude' must be sent together`, HttpStatus.BAD_REQUEST);
        }

        place.addressLabel = place.address;
        if (place.radius) {
            place.radius = place.radius < minimumRadius ? minimumRadius : place.radius;
        }
        
        return this.placeRepository.save({ ...placeFound, ...place });
    }

    async delete(placeId: string): Promise<void> {
        const place = await this.placeRepository.findOne({ where: {id: placeId} });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        await this.placeRepository.remove(place);
    }

    async addTag(placeId: string, tag: Tag): Promise<Place> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['tags'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        
        const tagFound = await this.tagRepository.findOne({ where: { tag: tag.tag } });
        if (!tagFound)
            tag = await this.tagRepository.save(tag);

        place.tags.push(tag);
        return this.placeRepository.save(place);
    }

    async removeTag(placeId: string, tag: Tag): Promise<Place> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['tags'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
            
        const tagFound = await this.tagRepository.findOne({ where: { tag: tag.tag } });
        if (!tagFound)
            throw new BusinessLogicException(`Tag with name ${tag.tag} was not found`, HttpStatus.NOT_FOUND);

        const tagIndex = place.tags.findIndex(t => t.tag === tagFound.tag)
        if (tagIndex === -1)
            throw new BusinessLogicException(`Tag with name ${tag.tag} is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);
        
        place.tags.splice(tagIndex, 1);
        const placeUpdated = await this.placeRepository.save(place);
        return placeUpdated;
    }

    async associateBusiness(placeId: string, businessId: string): Promise<Place> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['business'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        
        const business: Business = await this.businessRepository.findOne({ where: {id: businessId} });
        if (!business)
            throw new BusinessLogicException(`Business with id ${businessId} was not found`, HttpStatus.NOT_FOUND);
        
        place.business = business;
        return this.placeRepository.save(place);
    }

    async dissociateBusiness(placeId: string, businessId: string): Promise<Place> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['business'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        
        const business: Business = await this.businessRepository.findOne({ where: {id: businessId} });
        if (!business)
            throw new BusinessLogicException(`Business with id ${businessId} was not found`, HttpStatus.NOT_FOUND);

        if (!place.business || (place.business.id !== business.id))
            throw new BusinessLogicException(`Invalid business`, HttpStatus.BAD_REQUEST);
        
        place.business = null;
        return this.placeRepository.save(place);
    }

    async getPosts(placeId: string): Promise<Post[]> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['posts'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        if (!place.posts.length)
            throw new BusinessLogicException(`Place with id ${placeId} has no posts`, HttpStatus.NO_CONTENT);
        return place.posts;
    }

    async getReviews(placeId: string): Promise<Review[]> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['reviews'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        if (!place.reviews.length)
            throw new BusinessLogicException(`Place with id ${placeId} has no reviews`, HttpStatus.NO_CONTENT);
        return place.reviews;
    }

    async addReview(placeId: string, clientId: string, review: Review): Promise<Review> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['tags'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        const client = await this.clientRepository.findOne({ where: {id: clientId}, relations: ['rank', 'missions', 'missions.mission', 'missions.mission.places', 'missions.mission.tag'] });
        if (!client)
            throw new BusinessLogicException(`Client with id ${clientId} was not found`, HttpStatus.NOT_FOUND);
        review.client = client;
        review.place = place;
        const newReview = await this.reviewRepository.save(review);

        client.missions.forEach(async mission => {
            if (mission.percentage < 1.0 && mission.mission.type === MissionType.REVIEW) {
                // si requiere que sea en algún lugar en específico, se verifica que sí sea el lugar, si no es, no se suma nada
                if (mission.mission.places.length && !mission.mission.places.find(p => p.id === review.place.id)) {
                    return ;
                }

                // si requiere que sea en algún tag en específico, se verifica que sí sea el tag, si no es, no se suma nada
                if (mission.mission.tag && !review.place.tags.find(t => t.tag === mission.mission.tag.tag)) {
                    return ;
                }

                // si requiredN = 5 (se deben subir 5 reviews), se suma 1/5 que es el 20% al porcentaje de la misión
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

        newReview.client = clientUpdated;
        return newReview;
    }

    async updateReview(placeId: string, reviewId: string, review: Review): Promise<Review> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['reviews'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        
        const reviewFound = await this.reviewRepository.findOne({ where: {id: reviewId} });
        if (!reviewFound)
            throw new BusinessLogicException(`Review with id ${reviewId} was not found`, HttpStatus.NOT_FOUND);

        const reviewIndex = place.reviews.findIndex(r => r.id === reviewFound.id);
        if (reviewIndex === -1)
            throw new BusinessLogicException(`Review with id ${reviewId} is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);

        return await this.reviewRepository.save({ ...reviewFound, ...review });
    }

    async deleteReview(placeId: string, reviewId: string): Promise<Review> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['reviews'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        
        const review = await this.reviewRepository.findOne({ where: {id: reviewId} });
        if (!review)
            throw new BusinessLogicException(`Review with id ${reviewId} was not found`, HttpStatus.NOT_FOUND);
        
        const reviewIndex = place.reviews.findIndex(r => r.id === review.id);
        if (reviewIndex === -1)
            throw new BusinessLogicException(`Review with id ${review}) is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);
        
        await this.reviewRepository.remove(review);
        return review;
    }

    async getEvents(placeId: string): Promise<Event[]> {
        const place: Place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['events'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        if (!place.events.length)
            throw new BusinessLogicException(`Place with id ${placeId} has no events`, HttpStatus.NO_CONTENT);
        return place.events;
    }
    
    async addEvent(placeId: string, event: Event): Promise<Event> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['events'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        event.place = place;
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);
        if (event.startDate < new Date()) 
            throw new BusinessLogicException(`The event start date must be a future date`, HttpStatus.BAD_REQUEST);
        if (event.endDate <= event.startDate) 
            throw new BusinessLogicException(`The event end date must be after the start date`, HttpStatus.BAD_REQUEST);
        const newEvent = await this.eventRepository.save(event);
        return newEvent;
    }

    async updateEvent(placeId: string, eventId: string, event: Event): Promise<Event> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['events'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        const eventFound = await this.eventRepository.findOne({ where: {id: eventId} });
        if (!eventFound)
            throw new BusinessLogicException(`Event with id ${eventId} was not found`, HttpStatus.NOT_FOUND);
        const eventIndex = place.events.findIndex(e => e.id === eventFound.id);
        if (eventIndex === -1)
            throw new BusinessLogicException(`Event with id ${eventId} is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);

        if (eventFound.endDate < new Date())
            throw new BusinessLogicException(`The event has already finished and cannot be modified`, HttpStatus.BAD_REQUEST);

        event.startDate = event.startDate ? new Date(event.startDate) : eventFound.startDate;
        event.endDate = event.endDate ? new Date(event.endDate) : eventFound.endDate;

        if (event.startDate < new Date())
            throw new BusinessLogicException(`The event start date must be a future date`, HttpStatus.BAD_REQUEST);
        if (event.endDate <= event.startDate)
            throw new BusinessLogicException(`The event end date must be after the start date`, HttpStatus.BAD_REQUEST);
        
        return await this.eventRepository.save({ ...eventFound, ...event });
    }

    async deleteEvent(placeId: string, eventId: string): Promise<Event> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['events'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        const event = await this.eventRepository.findOne({ where: {id: eventId} });
        if (!event)
            throw new BusinessLogicException(`Event with id ${eventId} was not found`, HttpStatus.NOT_FOUND);
        const eventIndex = place.events.findIndex(e => e.id === event.id);
        if (eventIndex === -1)
            throw new BusinessLogicException(`Event with id ${eventId} is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);
        await this.eventRepository.remove(event);
        return event;
    }

    async getMedia(placeId: string): Promise<Media[]> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['media'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        if (!place.media.length)
            throw new BusinessLogicException(`Place with id ${placeId} has no media`, HttpStatus.NO_CONTENT);
        return place.media;
    }

    async addMedia(placeId: string, media: Media): Promise<Media> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['media'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        media.place = place;
        return await this.mediaRepository.save(media);
    }

    async deleteMedia(placeId: string, mediaId: string): Promise<Media> {
        const place = await this.placeRepository.findOne({ where: {id: placeId}, relations: ['media'] });
        if (!place)
            throw new BusinessLogicException(`Place with id ${placeId} was not found`, HttpStatus.NOT_FOUND);
        const media = await this.mediaRepository.findOne({ where: {id: mediaId} });
        if (!media)
            throw new BusinessLogicException(`Media with id ${mediaId} was not found`, HttpStatus.NOT_FOUND);
        const mediaIndex = place.media.findIndex(m => m.id === media.id);
        if (mediaIndex === -1)
            throw new BusinessLogicException(`Media with id ${mediaId} is not associated with place with id ${placeId}`, HttpStatus.BAD_REQUEST);
        await this.mediaRepository.remove(media);
        return media;
    }
}
