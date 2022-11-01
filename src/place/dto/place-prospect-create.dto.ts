import { Transform } from 'class-transformer';
import { IsOptional, IsNotEmpty, IsString, IsNumber, IsUrl, ArrayNotEmpty, IsEnum, Min } from 'class-validator';
import { Country } from '../../shared/enums/country.enum';

export class PlaceProspectCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsEnum(Country)
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
    @Min(0)
    @IsOptional()
    readonly radius: number;

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

    @IsNotEmpty()
    @ArrayNotEmpty({ message: 'You must provide at least one tag' })
    @Transform(({value}) => value.map(tag => tag.toLowerCase()))
    readonly tags: string[];
}
