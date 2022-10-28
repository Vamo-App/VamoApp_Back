import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class ClientUpdateDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.toLowerCase())
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}