import { Controller, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TagService } from './tag.service';
import { Tag } from '../tag/tag.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tags')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class TagController {
    constructor(private readonly service: TagService) {}

    @Get()
    async getAll(): Promise<Tag[]> {
        return await this.service.getAll();
    }

    @Post(':tag')
    async create(@Param('tag') tag: string): Promise<Tag> {
        return await this.service.create(tag);
    }

    @Put(':tag')
    async update(@Param('tag') tag: string, @Query('tag') newTag: string): Promise<Tag> {
        return await this.service.update(tag, newTag);
    }

    @Delete(':tag')
    @HttpCode(204)
    async delete(@Param('tag') tag: string): Promise<void> {
        return await this.service.delete(tag);
    }
}
