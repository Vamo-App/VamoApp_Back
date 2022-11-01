import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client/client.entity';
import { Place } from './place/place.entity';
import { Weight } from './weight/weight.entity';

@Injectable()
export class AppService {
  //@Inject(ConfigService)
  //public config;
  constructor (
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>
  ) {}

  async vamo(clientIds: string[], longitude: number, latitude: number, radius: number ): Promise<Place[]> {
    let client: Client[] = [];
    let place: Place[] = [];
    for (let i = 0; i < clientIds.length; i++) {
      client.push(await this.clientRepository.findOne({where: {id: clientIds[i]}})); 
    }
    for (let i = 0; i < client.length; i++) {
      let cliente: Client = client[i];
      let Weight: Weight[] = cliente.weights;
      for (let j = 0; j < Weight.length; j++) {
        console.log(Weight[j].tag.tag);
      }
    }


    return place; 
  }

  getHello(): string {
    //const database = this.config.get('DATABASE_USERNAME');
    //console.log({ database });
    return 'Vamo App!';
  }
}
