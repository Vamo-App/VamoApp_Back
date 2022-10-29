import { Injectable } from '@nestjs/common';
import { VamoUser } from './vamo-user';

@Injectable()
export class VamoUserService {
    //TODO Definir la entidad VamoUser (que se puedan crear a la DB)
    private users: VamoUser[] = [
        new VamoUser(1, process.env.ADMIN_USERNAME, process.env.ADMIN_PASSWORD, ["admin"])
    ];

    async findOne(username: string): Promise<VamoUser | undefined> {
        return this.users.find(user => user.username === username);
    }
}
