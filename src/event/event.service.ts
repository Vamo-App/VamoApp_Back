import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { Media } from '../media/media.entity';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>
    ) {}

    async getMedia(eventId: string): Promise<Media[]> {
        const event = await this.eventRepository.findOne({ where: {id: eventId}, relations: ['media'] });
        if (!event)
            throw new BusinessLogicException(`The event with the id (${eventId}) was not found`, HttpStatus.NOT_FOUND);
        if (!event.media.length)
            throw new BusinessLogicException(`The event with the id (${eventId}) has no media`, HttpStatus.NO_CONTENT);
        return event.media;
    }

    async addMedia(eventId: string, media: Media): Promise<Media> {
        const event = await this.eventRepository.findOne({ where: {id: eventId}, relations: ['media'] });
        if (!event)
            throw new BusinessLogicException(`The event with the id (${eventId}) was not found`, HttpStatus.NOT_FOUND);
        media.event = event;
        return await this.mediaRepository.save(media);
    }

    async deleteMedia(eventId: string, mediaId: string): Promise<Media> {
        const event = await this.eventRepository.findOne({ where: {id: eventId}, relations: ['media'] });
        if (!event)
            throw new BusinessLogicException(`The event with the id (${eventId}) was not found`, HttpStatus.NOT_FOUND);
        const media = await this.mediaRepository.findOne({ where: {id: mediaId} });
        if (!media)
            throw new BusinessLogicException(`The media with the id (${mediaId}) was not found`, HttpStatus.NOT_FOUND);
        const mediaIndex = event.media.findIndex(m => m.id === media.id);
        if (mediaIndex === -1)
            throw new BusinessLogicException(`The media with the id (${mediaId}) is not part of the event with the id (${eventId})`, HttpStatus.NOT_FOUND);
        event.media.splice(mediaIndex, 1);
        await this.eventRepository.save(event);
        await this.mediaRepository.delete(media.id);
        return media;
    }
}
