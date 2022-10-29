import { Controller, Body, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { PlaceService } from './place.service';
import { Place } from './place.entity';
import { Tag } from '../tag/tag.entity';
import { Review } from '../review/review.entity';
import { Post as PostEntity } from '../post/post.entity';
import { Media } from '../media/media.entity';
import { PlaceProspectCreateDto, PlaceCreateDto, PlaceUpdateDto } from './dto';
import { ReviewCreateDto, ReviewUpdateDto } from '../review/dto';
import { EventCreateDto, EventUpdateDto } from '../event/dto';
import { MediaCreateDto } from '../media/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('places')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class PlaceController {
    constructor(private readonly service: PlaceService) {}

    @Post()
    async createProspect(@Body() placeDto: PlaceProspectCreateDto): Promise<Place> {
        const { tags } = placeDto;
        const place = plainToInstance(Place, placeDto);
        place.tags = tags.map(tag => {
            const t = new Tag();
            t.tag = tag;
            return t;
        });
        place.prospect = true;
        return await this.service.create(place);
    }

    @Post(':placeId/validate')
    async validateProspect(@Param('placeId') placeId: string, @Query('b') validate: string): Promise<Place> {
        const b: boolean = validate === "true";
        return await this.service.validateProspect(placeId, b);
    }

    @Get()
    async getAll(@Query('q') q:string): Promise<Place[]> {
        return await this.service.getAll(q);
    }

    @Get(':placeId')
    async getOne(@Param('placeId') placeId: string): Promise<Place> {
        return await this.service.getOne(placeId);
    }

    @Post('admin')
    async create(@Body() placeDto: PlaceCreateDto): Promise<Place> {
        const { tags } = placeDto;
        const place = plainToInstance(Place, placeDto);
        place.tags = tags.map(tag => {
            const t = new Tag();
            t.tag = tag;
            return t;
        });        place.prospect = false;
        return await this.service.create(place);
    }

    @Put(':placeId')
    async update(@Param('placeId') placeId: string, @Body() placeDto: PlaceUpdateDto): Promise<Place> {
        const place = plainToInstance(Place, placeDto);
        return await this.service.update(placeId, place);
    }

    @Delete(':placeId')
    async delete(@Param('placeId') placeId: string): Promise<Place> {
        return await this.service.delete(placeId);
    }

    @Post(':placeId/tags/:tag')
    async addTag(@Param('placeId') placeId: string, @Param('tag') tag: string): Promise<Place> {
        return await this.service.addTag(placeId, tag);
    }

    @Delete(':placeId/tags/:tag')
    async removeTag(@Param('placeId') placeId: string, @Param('tag') tag: string): Promise<Place> {
        return await this.service.removeTag(placeId, tag);
    }

    @Post(':placeId/business/:businessId')
    async associateBusiness(@Param('placeId') placeId: string, @Param('businessId') businessId: string): Promise<Place> {
        return await this.service.associateBusiness(placeId, businessId);
    }

    @Delete(':placeId/business/:businessId')
    async dissociateBusiness(@Param('placeId') placeId: string, @Param('businessId') businessId: string): Promise<Place> {
        return await this.service.dissociateBusiness(placeId, businessId);
    }

    @Get(':placeId/posts')
    async getPosts(@Param('placeId') placeId: string): Promise<PostEntity[]> {
        return await this.service.getPosts(placeId);
    }

    @Get(':placeId/reviews')
    async getReviews(@Param('placeId') placeId: string): Promise<Review[]> {
        return await this.service.getReviews(placeId);
    }

    @Post(':placeId/reviews')
    async addReview(@Param('placeId') placeId: string, @Body() reviewDto: ReviewCreateDto): Promise<Review> {
        const review = plainToInstance(Review, reviewDto);
        return await this.service.addReview(placeId, review);
    }

    @Put(':placeId/reviews/:reviewId')
    async updateReview(@Param('placeId') placeId: string, @Param('reviewId') reviewId: string, @Body() reviewDto: ReviewUpdateDto): Promise<Review> {
        const review = plainToInstance(Review, reviewDto);
        return await this.service.updateReview(placeId, reviewId, review);
    }

    @Delete(':placeId/reviews/:reviewId')
    async deleteReview(@Param('placeId') placeId: string, @Param('reviewId') reviewId: string): Promise<Review> {
        return await this.service.deleteReview(placeId, reviewId);
    }

    @Get(':placeId/events')
    async getEvents(@Param('placeId') placeId: string): Promise<Event[]> {
        return await this.service.getEvents(placeId);
    }

    @Post(':placeId/events')
    async addEvent(@Param('placeId') placeId: string, @Body() eventDto: EventCreateDto): Promise<Event> {
        const event = plainToInstance(Event, eventDto);
        return await this.service.addEvent(placeId, event);
    }

    @Put(':placeId/events/:eventId')
    async updateEvent(@Param('placeId') placeId: string, @Param('eventId') eventId: string, @Body() eventDto: EventUpdateDto): Promise<Event> {
        const event = plainToInstance(Event, eventDto);
        return await this.service.updateEvent(placeId, eventId, event);
    }

    @Delete(':placeId/events/:eventId')
    async deleteEvent(@Param('placeId') placeId: string, @Param('eventId') eventId: string): Promise<Event> {
        return await this.service.deleteEvent(placeId, eventId);
    }

    @Get(':placeId/media')
    async getMedia(@Param('placeId') placeId: string): Promise<Media[]> {
        return await this.service.getMedia(placeId);
    }

    @Post(':placeId/media')
    async addMedia(@Param('placeId') placeId: string, @Body() mediaDto: MediaCreateDto): Promise<Media> {
        const media = plainToInstance(Media, mediaDto);
        return await this.service.addMedia(placeId, media);
    }

    @Delete(':placeId/media/:mediaId')
    async deleteMedia(@Param('placeId') placeId: string, @Param('mediaId') mediaId: string): Promise<Media> {
        return await this.service.deleteMedia(placeId, mediaId);
    }
}
