import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, IsUrl, MinLength, Matches } from 'class-validator';

export class BusinessUpdateDto {
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
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    @IsNotEmpty()
    readonly password: string;

    @IsUrl()
    @IsNotEmpty()
    readonly picture: string;
}
