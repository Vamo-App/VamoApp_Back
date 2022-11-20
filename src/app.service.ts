import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BusinessLogicException } from "./shared/errors/business-errors";
import { HttpStatus } from "@nestjs/common";
import { Repository } from "typeorm";
import { Client } from "./client/client.entity";
import { Business } from "./business/business.entity";
import { CredentialsDto } from "./shared/utils/credentials";
import { Place } from "./place/place.entity";
import { Weight } from "./weight/weight.entity";

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>
  ) {}

  async loginClient(credentials: CredentialsDto): Promise<Client> {
    const client = await this.clientRepository.findOne({
      where: { email: credentials.email },
    });
    if (!client) {
      throw new BusinessLogicException(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    if (client.password !== credentials.password) {
      throw new BusinessLogicException(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    return client;
  }
  async vamo(
    clientIds: string[],
    longitude: number,
    latitude: number,
    radius: number
    
  ): Promise<Place[]> {
    let client: Client[] = [];
    let place: Place[] = [];
    let HashTable = new Map();
    let best_tags = [];
    for (let i = 0; i < clientIds.length; i++) {
      client.push(
        await this.clientRepository.findOne({
          where: { id: clientIds[i] },
          relations: ["weights.tag"],
        })
      );
    }

    for (let i = 0; i < client.length; i++) {
      let cliente: Client = client[i];
      let Weight: Weight[] = cliente.weights;
      for (let j = 0; j < Weight.length; j++) {
        let tag = Weight[j].tag.tag;
        let peso = Weight[j].weight;
        if (HashTable.has(tag)) {
          let value = HashTable.get(tag);
          HashTable.set(tag, value + peso/client.length);
        } else {
          HashTable.set(tag, peso/client.length);
        }
      }
    }
    best_tags = Array.from(HashTable.entries()).sort((a, b) => b[1] - a[1]);
    let places_in_order = [];
    let ids:String[] = [];
    for (let i = 0; i < best_tags.length; i++) {
      let tag = best_tags[i][0];
      let places = await this.placeRepository
        .createQueryBuilder("place")
        .leftJoinAndSelect("place.tags", "tags")
        .where(':tag IN (SELECT ptp."tagTag" FROM tag_places_place ptp where ptp."placeId"=place.id)', {tag: tag})
        .getMany();
      for (let j = 0; j < places.length; j++) {
        let place = places[j];
        if ( ids.indexOf(place.id) == -1) {
          places_in_order.push(place)
          ids.push(place.id);
        }
      }
    }
    
    return places_in_order;
  }

  async loginBusiness(credentials: CredentialsDto): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { email: credentials.email },
    });
    if (!business) {
      throw new BusinessLogicException(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    if (business.password !== credentials.password) {
      throw new BusinessLogicException(
        "Invalid email or password",
        HttpStatus.UNAUTHORIZED
      );
    }
    return business;
  }

  getHello(): string {
    return "Vamo App!";
  }
}
