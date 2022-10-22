import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Place } from './place/place.entity';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('vamo')
  async vamo(): Promise<Place[]> {
    //TODO O
    //TODO B
    //TODO D
    return ;
  }

  @Get('login')
  async login(): Promise<Client|Business> {
    //TODO B
    return ;
  }

  @Get('')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
