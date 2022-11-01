import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client/client.entity';
import { Place } from './place/place.entity';

@Injectable()
export class AppService {
  //@Inject(ConfigService)
  //public config;
  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>
  ) {}

  async vamo(clientIds: string[], longitude: number, latitude: number, radius: number ): Promise<Place[]> {
    let client: Client[] = [];
    let place: Place[] = [];
    for (let i = 0; i < clientIds.length; i++) {
      client.push(await this.clientRepository.findOne({where: {id: clientIds[i]}})); 
    }
    return place; 
  }

  getHello(): string {
    //const database = this.config.get('DATABASE_USERNAME');
    //console.log({ database });
    return 'Vamo App!';
  }
}
