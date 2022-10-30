import { Controller, Body, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards, Query } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from '../shared/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MissionService } from '../mission/mission.service';
import { MissionCreateDto, MissionUpdateDto } from '../mission/dto';
import { Mission } from '../mission/mission.entity';

@Controller('missions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class MissionController {
    constructor(private readonly service: MissionService) {}

    @Get()
    async getAll(): Promise<Mission[]> {
        return await this.service.getAll();
    }

    @Post()
    async create(@Body() missionDto: MissionCreateDto): Promise<Mission> {
        const mission: Mission = plainToInstance(Mission, missionDto);
        return await this.service.create(mission);
    }

    @Put(':missionId')
    async update(@Param('missionId') missionId: string, @Body() missionDto: MissionUpdateDto): Promise<Mission> {
        const mission: Mission = plainToInstance(Mission, missionDto);
        return await this.service.update(missionId, mission);
    }
}
