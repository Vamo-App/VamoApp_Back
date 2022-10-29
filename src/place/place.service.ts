import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Place } from './place.entity';
import { Review } from '../review/review.entity';
import { Post } from '../post/post.entity';
import { Media } from '../media/media.entity';

@Injectable()
export class PlaceService {
    constructor(
        @InjectRepository(Place)
        private readonly placeRepository: Repository<Place>,
    ) {}

    async createProspect(place: Place): Promise<Place> {
        // TODO T
        return ;
    }

    async validateProspect(placeId: string, validate: boolean): Promise<Place> {
        // TODO T
        return ;
    }

    async getAll(q: string): Promise<Place[]> {
        // TODO T
        return ;
    }

    async getOne(placeId: string): Promise<Place> {
        // TODO T
        return ;
    }

    async create(place: Place): Promise<Place> {
        // TODO T
        return ;
    }

    async update(placeId: string, place: Place): Promise<Place> {
        // TODO T
        return ;
    }

    async delete(placeId: string): Promise<Place> {
        // TODO T
        return ;
    }

    async addTag(placeId: string, tag: string): Promise<Place> {
        // TODO T
        return ;
    }

    async removeTag(placeId: string, tag: string): Promise<Place> {
        // TODO T
        return ;
    }

    async associateBusiness(placeId: string, businessId: string): Promise<Place> {
        // TODO T
        return ;
    }

    async dissociateBusiness(placeId: string, businessId: string): Promise<Place> {
        // TODO T
        return ;
    }

    async getPosts(placeId: string): Promise<Post[]> {
        // TODO T
        return ;
    }

    async getReviews(placeId: string): Promise<Review[]> {
        // TODO T
        return ;
    }

    async addReview(placeId: string, review: Review): Promise<Review> {
        // TODO T
        return ;
    }

    async updateReview(placeId: string, reviewId: string, review: Review): Promise<Review> {
        // TODO T
        return ;
    }

    async deleteReview(placeId: string, reviewId: string): Promise<Review> {
        // TODO T
        return ;
    }

    async getEvents(placeId: string): Promise<Event[]> {
        // TODO T
        return ;
    }
    
    async addEvent(placeId: string, event: Event): Promise<Event> {
        // TODO T
        return ;
    }

    async updateEvent(placeId: string, eventId: string, event: Event): Promise<Event> {
        // TODO T
        return ;
    }

    async deleteEvent(placeId: string, eventId: string): Promise<Event> {
        // TODO T
        return ;
    }

    async getMedia(placeId: string): Promise<Media[]> {
        // TODO T
        return ;
    }

    async addMedia(placeId: string, media: Media): Promise<Media> {
        // TODO T
        return ;
    }

    async deleteMedia(placeId: string, mediaId: string): Promise<Media> {
        // TODO T
        return ;
    }
}
