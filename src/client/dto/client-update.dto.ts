import { Transform } from 'class-transformer';
import { IsOptional, IsString, IsEmail, IsUrl, MinLength, Matches } from 'class-validator';

export class ClientUpdateDto {
    @IsEmail()
    @IsOptional()
    @Transform(({value}) => value.toLowerCase())
    readonly email: string;

    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @MinLength(8)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak, must contain at least one uppercase letter, one lowercase letter, one number or special character'})
    @IsOptional()
    readonly password: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsString()
    @IsOptional()
    readonly description: string;
}