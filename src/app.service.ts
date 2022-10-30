<<<<<<< HEAD
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from './client/client.entity';
import { Place } from './place/place.entity';
import { Weight } from './weight/weight.entity';
=======
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//import { ConfigService } from '@nestjs/config';
import { Client } from './client/client.entity';
import { Place } from './place/place.entity';
>>>>>>> 737b08a (archivo debug, y planteamiento del app.controller.ts)

@Injectable()
export class AppService {
  //@Inject(ConfigService)
  //public config;
  constructor (
    @InjectRepository(Client)
<<<<<<< HEAD
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>
=======
    private readonly clientRepository: Repository<Client>
>>>>>>> 737b08a (archivo debug, y planteamiento del app.controller.ts)
  ) {}

  async vamo(clientIds: string[], longitude: number, latitude: number, radius: number ): Promise<Place[]> {
    let client: Client[] = [];
    let place: Place[] = [];
<<<<<<< HEAD
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

=======
    //make a for in 
    for (let i = 0; i < clientIds.length; i++) {
      client.push(await this.clientRepository.findOne({where: {id: clientIds[i]}})); 
    }
>>>>>>> 737b08a (archivo debug, y planteamiento del app.controller.ts)

    return place; 
  }

  getHello(): string {
    //const database = this.config.get('DATABASE_USERNAME');
    //console.log({ database });
    return 'Vamo App!';
  }
}
