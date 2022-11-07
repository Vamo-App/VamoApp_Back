import { Controller, Body, Param, HttpCode, Get, Post, Put, Delete, UseInterceptors, UseGuards  } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessService } from './business.service';
import { Business } from './business.entity';
import { BusinessCreateDto, BusinessUpdateDto } from './dto';

@Controller('business')
@UseGuards(JwtAuthGuard)
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
export class BusinessController {
    constructor(private readonly service: BusinessService) {}

    @Post()
    async register(@Body() businessDto: BusinessCreateDto): Promise<Business> {
        const business: Business = plainToInstance(Business, businessDto);
        return await this.service.register(business);
    }

    @Get(':businessId')
    async getOne(@Param('businessId') businessId: string): Promise<Business> {
        return await this.service.getOne(businessId);
    }

    @Put(':businessId')
    async update(@Param('businessId') businessId: string, @Body() businessDto: BusinessUpdateDto): Promise<Business> {
        const business: Business = plainToInstance(Business, businessDto);
        return await this.service.update(businessId, business);
    }

    @Delete(':businessId')
    @HttpCode(204)
    async delete(@Param('businessId') businessId: string): Promise<void> {
        return await this.service.delete(businessId);
    }
}
