import { Controller, Body, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards, ClassSerializerInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { ClientService } from './client.service';
import { Client } from './client.entity';
import { Weight } from '../weight/weight.entity';
import { Tag } from '../tag/tag.entity';
import { Review } from '../review/review.entity';
import { Place } from '../place/place.entity';
import { Post as PostEntity } from '../post/post.entity';
import { MissionClient } from '../mission-client/mission-client.entity';
import { ClientCreateDto, ClientUpdateDto } from './dto';
import { PostCreateDto } from '../post/dto';
import { LocationClass } from '../shared/classes/location';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('clients')
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class ClientController {
    constructor(private readonly service: ClientService) {}

    @Post()
    async register(@Body() clientDto: ClientCreateDto): Promise<Client> {
        const { tags } = clientDto;
        const client: Client = plainToInstance(Client, clientDto);
        client.weights = tags.map(tag => {
            const w:Weight = new Weight();
            w.tag = new Tag();
            w.tag.tag = tag;
            w.weight = 1; // asigna un peso inicial del 100% a cada tag seleccionado por el cliente
            return w;
        });
        return await this.service.register(client);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAll(): Promise<Client[]> {
        return await this.service.getAll();
    }

    @Get('?q=:q')
    async getAllFiltered(@Param('q') q: string): Promise<Client[]> {
        return await this.service.getAllFiltered(q);
    }

    @Get(':clientId')
    async getOne(@Param('clientId') clientId: string): Promise<Client> {
        return await this.service.getOne(clientId);
    }

    @Put(':clientId')
    async update(@Param('clientId') clientId: string, @Body() clientDto: ClientUpdateDto): Promise<Client> {
        const client: Client = plainToInstance(Client, clientDto);
        return await this.service.update(clientId, client);
    }

    @Delete(':clientId')
    @HttpCode(204)
    async delete(@Param('clientId') clientId: string): Promise<void> {
        return await this.service.delete(clientId);
    }

    @Get(':clientId/reviews')
    async getReviews(@Param('clientId') clientId: string): Promise<Review[]> {
        return await this.service.getReviews(clientId);
    }

    @Get(':clientId/pending')
    async getPendings(@Param('clientId') clientId: string): Promise<Place[]> {
        return await this.service.getPendings(clientId);
    }

    @Post(':clientId/pending/:placeId')
    async addPending(@Param('clientId') clientId: string, @Param('placeId') placeId: string): Promise<Place> {
        return await this.service.addPending(clientId, placeId);
    }

    @Delete(':clientId/pending/:placeId')
    @HttpCode(204)
    async removePending(@Param('clientId') clientId: string, @Param('placeId') placeId: string): Promise<Place> {
        return await this.service.removePending(clientId, placeId);
    }

    @Get(':clientId/liked')
    async getLiked(@Param('clientId') clientId: string): Promise<Place[]> {
        return await this.service.getLiked(clientId);
    }

    @Post(':clientId/liked/:placeId')
    async addLiked(@Param('clientId') clientId: string): Promise<Place> {
        return await this.service.addLiked(clientId);
    }

    @Delete(':clientId/liked/:placeId')
    @HttpCode(204)
    async removeLiked(@Param('clientId') clientId: string, @Param('placeId') placeId: string): Promise<Place> {
        return await this.service.removeLiked(clientId, placeId);
    }

    @Get(':clientId/posts')
    async getPosts(@Param('clientId') clientId: string): Promise<PostEntity[]> {
        return await this.service.getPosts(clientId);
    }

    @Post(':clientId/posts')
    async publishPost(@Param('clientId') clientId: string, @Body() postCreateDto: PostCreateDto): Promise<PostEntity> {
        const post: PostEntity = plainToInstance(PostEntity, postCreateDto);
        return await this.service.publishPost(clientId, post);
    }

    @Delete(':clientId/posts/:postId')
    async removePost(@Param('clientId') clientId: string, @Param('postId') postId: string): Promise<PostEntity> {
        return await this.service.removePost(clientId, postId);
    }

    @Get(':clientId/missions')
    async getMissions(@Param('clientId') clientId: string): Promise<MissionClient[]> {
        return await this.service.getMissions(clientId);
    }

    @Post(':clientId/missions/report')
    async reportLocationToAccomplishMissions(@Param('clientId') clientId: string, @Body() location:LocationClass): Promise<MissionClient[]> {
        return await this.service.reportLocationToAccomplishMissions(clientId, location);
    }
}
