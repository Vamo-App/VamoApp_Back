import { Inject, Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  //@Inject(ConfigService)
  //public config;

  getHello(): string {
    //const database = this.config.get('DATABASE_USERNAME');
    //console.log({ database });
    return 'Vamo App!';
  }
}
