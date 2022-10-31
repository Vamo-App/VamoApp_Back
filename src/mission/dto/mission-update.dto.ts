import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';

export class MissionUpdateDto {
    @IsString()
    @IsOptional()
    readonly name: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsNumber()
    @IsOptional()
    readonly prizeXp: number;

    @IsNumber()
    @IsOptional()
    readonly requiredN: number;

    @IsBoolean()
    @IsOptional()
    readonly base: boolean;

    @IsString()
    @IsOptional()
    readonly _tag: string;

    @IsOptional()
    readonly _places: string[];
}