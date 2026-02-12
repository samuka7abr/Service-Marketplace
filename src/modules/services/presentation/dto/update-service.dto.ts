import { IsString, IsBoolean, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateServiceDto {
    @ApiProperty({
        description: 'Nome do serviço',
        example: 'Desenvolvimento de Software',
        required: false,
        minLength: 3,
        maxLength: 100,
    })
    @IsOptional()
    @IsString({ message: 'O nome deve ser uma string' })
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    name?: string;

    @ApiProperty({
        description: 'Descrição do serviço',
        example: 'Desenvolvimento de aplicações web e mobile sob medida',
        required: false,
        minLength: 10,
        maxLength: 500,
    })
    @IsOptional()
    @IsString({ message: 'A descrição deve ser uma string' })
    @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres' })
    @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
    description?: string;

    @ApiProperty({
        description: 'Categoria do serviço',
        example: 'Tecnologia',
        required: false,
        minLength: 3,
        maxLength: 50,
    })
    @IsOptional()
    @IsString({ message: 'A categoria deve ser uma string' })
    @MinLength(3, { message: 'A categoria deve ter no mínimo 3 caracteres' })
    @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
    category?: string;

    @ApiProperty({
        description: 'Indica se o serviço está ativo',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean({ message: 'isActive deve ser um valor booleano' })
    isActive?: boolean;
}
