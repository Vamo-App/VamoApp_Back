import { IsOptional, IsNotEmpty, IsString, IsNumber, IsEnum, IsBoolean } from 'class-validator';
import { MissionType } from '../../shared/enums/mission-type.enum';

export class MissionCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsNumber()
    @IsNotEmpty()
    readonly prizeXp: number;

    @IsEnum(MissionType)
    @IsNotEmpty()
    readonly type: MissionType;

    @IsNumber()
    @IsNotEmpty()
    readonly requiredN: number;

    @IsBoolean()
    @IsNotEmpty()
    readonly base: boolean;

    @IsString()
    @IsOptional()
    readonly _tag: string;

    @IsOptional()
    readonly _places: string[];
}