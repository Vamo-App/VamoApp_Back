import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CredentialsDto {
    @IsString()
    @IsNotEmpty()
    @Transform(({value}) => value.toLowerCase())
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}