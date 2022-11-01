import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VamoUserService } from '../vamo-user/vamo-user.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: VamoUserService,
        private jwtService: JwtService,
    ) {}
    
    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(username);
        if (user && user.password === password) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user:any) {
        const payload = { username: user.username, sub: user.id };
        return {
            token: this.jwtService.sign(payload)
        };
    }
}
