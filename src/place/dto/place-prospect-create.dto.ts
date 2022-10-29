import { IsOptional, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class PlaceProspectCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsUrl()
    @IsOptional()
    readonly picture: string;

    @IsString()
    @IsNotEmpty()
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
}
