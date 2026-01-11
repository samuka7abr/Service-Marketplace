import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    MinLength,
} from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @MinLength(6)
    @IsOptional()
    password?: string;

    @IsString()
    @MinLength(3)
    @IsOptional()
    userName?: string;

    @IsEnum(['CLIENT', 'PROVIDER'])
    @IsOptional()
    type?: 'CLIENT' | 'PROVIDER';
}
