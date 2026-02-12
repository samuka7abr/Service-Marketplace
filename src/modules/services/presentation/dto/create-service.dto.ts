import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
    @ApiProperty({
        description: 'Nome do serviço',
        example: 'Desenvolvimento de Software',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'O nome deve ser uma string' })
    @IsNotEmpty({ message: 'O nome é obrigatório' })
    @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
    name: string;

    @ApiProperty({
        description: 'Descrição do serviço',
        example: 'Desenvolvimento de aplicações web e mobile sob medida',
        minLength: 10,
        maxLength: 500,
    })
    @IsString({ message: 'A descrição deve ser uma string' })
    @IsNotEmpty({ message: 'A descrição é obrigatória' })
    @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres' })
    @MaxLength(500, { message: 'A descrição deve ter no máximo 500 caracteres' })
    description: string;

    @ApiProperty({
        description: 'Categoria do serviço',
        example: 'Tecnologia',
        minLength: 3,
        maxLength: 50,
    })
    @IsString({ message: 'A categoria deve ser uma string' })
    @IsNotEmpty({ message: 'A categoria é obrigatória' })
    @MinLength(3, { message: 'A categoria deve ter no mínimo 3 caracteres' })
    @MaxLength(50, { message: 'A categoria deve ter no máximo 50 caracteres' })
    category: string;
}
