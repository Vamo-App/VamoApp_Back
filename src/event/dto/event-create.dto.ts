import { IsOptional, IsDateString, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class EventCreateDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsString()
    @IsNotEmpty()
    readonly type: string;

    @IsDateString()
    @IsNotEmpty()
    readonly startDate: string;

    @IsDateString()
    @IsNotEmpty()
    readonly endDate: string;

    @IsUrl()
    @IsOptional()
    readonly url: string;
}