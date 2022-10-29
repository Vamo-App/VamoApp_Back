import { IsOptional, IsString, IsUrl } from 'class-validator';

export class PlaceUpdateDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsString()
    @IsOptional()
    readonly address: string;

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
