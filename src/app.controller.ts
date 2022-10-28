import { Controller, Post, Get, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { Place } from './place/place.entity';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

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
  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async authlogin(@Request() req) {
      return this.authService.login(req.user);
  }
}
