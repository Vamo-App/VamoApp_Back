import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsString, IsEmail, IsUrl, MinLength, Matches } from 'class-validator';

export class BusinessCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly type: string;

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
    @IsOptional()
    readonly picture: string;
}
