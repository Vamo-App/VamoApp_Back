import { IsOptional, IsString, IsNumber, IsUrl, IsEnum } from 'class-validator';
import { Country } from '../../shared/enums/country.enum';

export class PlaceUpdateDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsEnum(Country)
    @IsOptional()
    readonly country: string;

    @IsString()
    @IsOptional()
    readonly state: string;

    @IsString()
    @IsOptional()
    readonly city: string;

    @IsString()
    @IsOptional()
    readonly neighborhood: string;

    @IsString()
    @IsOptional()
    readonly address: string;

    @IsNumber()
    @IsOptional()
    readonly latitude: number;

    @IsNumber()
    @IsOptional()
    readonly longitude: number;

    @IsNumber()
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

    @IsString()
    @IsOptional()
    readonly businessId: string;
}
