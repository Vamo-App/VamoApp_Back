import { IsOptional, IsDateString, IsNotEmpty, IsString, IsUrl, MinDate } from 'class-validator';

export class EventUpdateDto {
    @IsString()
    @IsOptional()
    readonly title: string;

    @IsString()
    @IsOptional()
    readonly description: string;

    @IsString()
    @IsOptional()
    readonly type: string;

    @IsDateString()
    @IsOptional()
    readonly startDate: string;

    @IsDateString()
    @IsOptional()
    readonly endDate: string;

    @IsUrl()
    @IsOptional()
    readonly url: string;
}