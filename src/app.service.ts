import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException } from './shared/errors/business-errors';
import { HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';
import { CredentialsDto } from './shared/utils/credentials';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async loginClient(credentials: CredentialsDto): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: {email: credentials.email} });
    if (!client) {
      throw new BusinessLogicException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    if (client.password !== credentials.password) {
      throw new BusinessLogicException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    return client;
  }

  async loginBusiness(credentials: CredentialsDto): Promise<Business> {
    const business = await this.businessRepository.findOne({ where: {email: credentials.email} });
    if (!business) {
      throw new BusinessLogicException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    if (business.password !== credentials.password) {
      throw new BusinessLogicException('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }
    return business;
  }

  getHello(): string {
    return 'Vamo App!';
  }
}
