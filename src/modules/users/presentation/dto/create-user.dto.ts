import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    userName: string;

    @IsEnum(['CLIENT', 'PROVIDER'])
    @IsNotEmpty()
    type: 'CLIENT' | 'PROVIDER';
}
