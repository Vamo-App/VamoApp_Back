import { Body, Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Place } from './place/place.entity';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('vamo')
  async vamo(@Body() payload:any): Promise<Place[]> {
    const { clientIds, longitude, latitude, radius } = payload;
    return await this.appService.vamo(clientIds, longitude, latitude, radius);
  }


  @Get("login")
  async login(): Promise<Client | Business> {
    //TODO B
    return;
  }

  @Get("")
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}
