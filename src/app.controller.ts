import {Body, Controller, Post, Get, Request, UseGuards, Res, Param} from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';
import { Place } from './place/place.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService
  ) {}

  @Get('vamo')
  async vamo(@Body() payload: any): Promise<Place[]> {
    const { clients, longitude, latitude, radius } = payload;
    return await this.appService.vamo(clients, +longitude, +latitude, +radius);
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
  
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async authlogin(@Request() req) {
      return this.authService.login(req.user);
  }

  @Get('dummy/:code')
  async dummy(@Param('code') code: string, @Res({ passthrough:true }) res: Response) {
    res.status((isNaN(+code) || +code < 200 || +code > 999) ? 418 : +code);
    return { code };
  }
}
