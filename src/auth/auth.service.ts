import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VamoUser } from '../vamo-user/vamo-user';
import { VamoUserService } from '../vamo-user/vamo-user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: VamoUserService,
        private jwtService: JwtService
    ) {}
 
    async validateUser(username: string, password: string): Promise<any> {
        const user: VamoUser = await this.usersService.findOne(username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(req: any) {
        const payload = { username: req.user.username, sub: req.user.id };
        return {
            token: this.jwtService.sign(payload, { privateKey: process.env.JWT_SECRET }),
        };
    }
}
