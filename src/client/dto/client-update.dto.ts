import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsUrl, MinLength, Matches } from 'class-validator';

export class ClientUpdateDto {
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => value.toLowerCase())
    readonly email: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak, must contain at least one uppercase letter, one lowercase letter, one number or special character'})
    @IsNotEmpty()
    readonly password: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;
}