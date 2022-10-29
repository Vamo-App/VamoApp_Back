import { Controller, Param, Body, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { RankService } from './rank.service';
import { Rank } from './rank.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RankCreateDto, RankUpdateDto } from './dto';

@Controller('ranks')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class RankController {
    constructor(private readonly service: RankService) {}

    @Get()
    async getAll(): Promise<Rank[]> {
        return await this.service.getAll();
    }

    @Post()
    async create(@Body() rankDto: RankCreateDto): Promise<Rank> {
        const rank = plainToInstance(Rank, rankDto);
        return await this.service.create(rank);
    }

    @Put(':rankName')
    async update(@Param('rankName') rankName: string, @Body() rankDto: RankUpdateDto): Promise<Rank> {
        const rank = plainToInstance(Rank, rankDto);
        return await this.service.update(rankName, rank);
    }

    @Delete(':rankName')
    @HttpCode(204)
    async delete(@Param('rankName') rankName: string): Promise<void> {
        return await this.service.delete(rankName);
    }
}
