import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUrl, ArrayNotEmpty } from 'class-validator';

export class ClientCreateDto {
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

    @IsNotEmpty()
    @ArrayNotEmpty({ message: 'You must provide at least one tag' })
    @Transform(({value}) => value.map(tag => tag.toLowerCase()))
    readonly tags: string[];
}