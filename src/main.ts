import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Validação global
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Configuração do Swagger
    const config = new DocumentBuilder()
        .setTitle('Service Marketplace API')
        .setDescription('API para gerenciamento de marketplace de serviços')
        .setVersion('1.0')
        .addTag('Serviços')
        .addTag('Solicitações')
        .addTag('Propostas')
        .addTag('Usuários')
        .addTag('Autenticação')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    // CORS (se necessário)
    app.enableCors();

    await app.listen(process.env.PORT ?? 3000);
    console.log(`Aplicação rodando na porta ${process.env.PORT ?? 3000}`);
    console.log(
        `Documentação Swagger disponível em http://localhost:${process.env.PORT ?? 3000}/api`,
    );
}
bootstrap();
