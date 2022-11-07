import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from '../shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Business } from './business.entity';

@Injectable()
export class BusinessService {
    constructor (
        @InjectRepository(Business)
        private readonly businessRepository: Repository<Business>
    ) {}

    async register(business: Business): Promise<Business> {
        const businessFound = await this.businessRepository.findOne({ where: {email: business.email} });
        if (businessFound)
            throw new BusinessLogicException(`The business with the email (${business.email}) already exists`, HttpStatus.BAD_REQUEST);
        
        return await this.businessRepository.save(business);
    }

    async getOne(businessId: string): Promise<Business> {
        const business = await this.businessRepository.findOne({ where: {id:businessId}, relations: ['places'] });
        if (!business)
            throw new BusinessLogicException(`The business with the id (${businessId}) was not found`, HttpStatus.NOT_FOUND);
        return business;
    }

    async update(businessId: string, business: Business): Promise<Business> {
        const businessToUpdate = await this.businessRepository.findOne({ where: {id:businessId}, relations: ['places'] });
        if (!businessToUpdate)
            throw new BusinessLogicException(`The business with the id (${businessId}) was not found`, HttpStatus.NOT_FOUND);

        if (business.email && (business.email !== businessToUpdate.email)) {
            const businessFound = await this.businessRepository.findOne({ where: {email: business.email}});
            if (businessFound)
                throw new BusinessLogicException(`The business with the email (${business.email}) already exists`, HttpStatus.BAD_REQUEST)
        }

        return await this.businessRepository.save({...businessToUpdate, ...business});
    }

    async delete(businessId: string): Promise<void> {
        const business =  await this.businessRepository.findOne({ where: {id:businessId} });
        if (!business)
            throw new BusinessLogicException(`The business with the id (${businessId}) was not found`, HttpStatus.NOT_FOUND);
        await this.businessRepository.remove(business);
    }
}
