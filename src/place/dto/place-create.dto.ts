import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsString, IsUrl, ArrayNotEmpty, IsNumber } from 'class-validator';

export class PlaceCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
    readonly country: string;

    @IsString()
    @IsNotEmpty()
    readonly state: string;

    @IsString()
    @IsNotEmpty()
    readonly city: string;

    @IsString()
    @IsOptional()
    readonly neighborhood: string;

    @IsString()
    @IsNotEmpty()
    readonly address: string;

    @IsNumber()
    @IsOptional()
    readonly latitude: number;

    @IsNumber()
    @IsOptional()
    readonly longitude: number;

    @IsString()
    @IsOptional()
    readonly phone: string;

    @IsUrl()
    @IsOptional()
    readonly website: string;

    @IsUrl()
    @IsOptional()
    readonly facebook: string;

    @IsUrl()
    @IsOptional()
    readonly instagram: string;

    @IsUrl()
    @IsOptional()
    readonly tiktok: string;

    @IsString()
    @IsOptional()
    readonly businessId: string;

    @IsNotEmpty()
    @ArrayNotEmpty({ message: 'You must provide at least one tag' })
    @Transform(({value}) => value.map(tag => tag.toLowerCase()))
    readonly tags: string[];
}
 