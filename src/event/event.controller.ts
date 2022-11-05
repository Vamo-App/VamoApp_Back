import { Controller, Body, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Event } from './event.entity';
import { Media } from '../media/media.entity';
import { EventService } from './event.service';
import { MediaCreateDto } from '../media/dto';

@Controller('events')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class EventController {
    constructor(private readonly service: EventService) {}

    @Get(':eventId/media')
    async getMedia(@Param('eventId') eventId: string): Promise<Media[]> {
        return await this.service.getMedia(eventId);
    }

    @Post(':eventId/media')
    async addMedia(@Param('eventId') eventId: string, @Body() mediaDto: MediaCreateDto): Promise<Media> {
        const media = plainToInstance(Media, mediaDto);
        return await this.service.addMedia(eventId, media);
    }

    @Delete(':eventId/media/:mediaId')
    @HttpCode(204)
    async deleteMedia(@Param('eventId') eventId: string, @Param('mediaId') mediaId: string): Promise<Media> {
        return await this.service.deleteMedia(eventId, mediaId);
    }
}
