import { Controller, Post, Get, Request, UseGuards, Res, Param, Body, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import { BusinessErrorsInterceptor } from './shared/interceptors/business-errors.interceptor';
import { TransformInterceptor } from './shared/interceptors/transform.interceptor';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { Place } from './place/place.entity';
import { Client } from './client/client.entity';
import { Business } from './business/business.entity';
import { CredentialsDto } from './shared/utils/credentials';

@Controller()
@UseInterceptors(BusinessErrorsInterceptor, TransformInterceptor)
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

  @Get('login/client')
  async loginClient(@Body() credentials: CredentialsDto): Promise<Client> {
    return this.appService.loginClient(credentials);
  }

  @Get('login/business')
  async loginBusiness(@Body() credentials: CredentialsDto): Promise<Business> {
    return this.appService.loginBusiness(credentials);
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

  @Get('dummy/:code')
  async dummy(@Param('code') code: string, @Res({ passthrough:true }) res: Response) {
    res.status((isNaN(+code) || +code < 200 || +code > 999) ? 418 : +code);
    return { code };
  }
}
