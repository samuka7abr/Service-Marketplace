<div align="center">

# 🛍️ Service Marketplace API

### *Uma plataforma escalável e moderna para conectar clientes e prestadores de serviços*

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

</div>

---

## 📋 Sobre o Projeto

**Service Marketplace** é uma API REST robusta que simula um marketplace de serviços, onde **clientes** criam solicitações e **prestadores** enviam propostas competitivas. O projeto demonstra práticas avançadas de arquitetura de software, integrando serviços AWS para processamento assíncrono, notificações em tempo real e armazenamento de mídia.

### ✨ Destaques

- 🏗️ **Clean Architecture** com separação clara de responsabilidades
- 🎯 **Princípios SOLID** aplicados rigorosamente
- ☁️ **Arquitetura Serverless** com AWS Lambda
- 📨 **Processamento Assíncrono** via DynamoDB Streams
- 📦 **Upload Direto ao S3** com Signed URLs
- 🔔 **Sistema de Notificações** multi-canal (Email + SNS)
- 🐳 **LocalStack** para desenvolvimento local

---

## 🏛️ Arquitetura

### Stack Tecnológica

<div align="center">

| Backend | Database | Cloud Services | DevOps |
|:-------:|:--------:|:--------------:|:------:|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dynamodb/dynamodb-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" width="50"/> |
| NestJS | DynamoDB | AWS Lambda | Docker |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" width="50"/> | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="50"/> |
| TypeScript | Streams | Amazon S3 | Node.js |

</div>

### Serviços AWS Integrados

```mermaid
graph LR
    A[API NestJS] --> B[DynamoDB]
    B --> C[DynamoDB Streams]
    C --> D[Lambda - Notifications]
    D --> E[SES - Email]
    D --> F[SNS - Events]
    A --> G[S3]
    G --> H[Lambda - Media Processor]
    H --> B
```

---

## 🧩 Módulos da Aplicação

### 🔐 **Auth Module**
Autenticação e autorização com JWT
- Login/Register
- Refresh Token
- Validação de usuários

### 👥 **Users Module**
Gerenciamento de usuários
- Criação de contas (CLIENT/PROVIDER)
- Atualização de perfis
- Diferenciação de tipos de usuário

### 🛠️ **Services Module**
Catálogo de serviços
- CRUD de serviços disponíveis
- Categorização
- Associação com solicitações

### 📝 **Requests Module**
Solicitações de clientes
- Criar requests
- Status tracking (OPEN → IN_NEGOTIATION → CLOSED)
- Query via GSI (Global Secondary Index)

### 💼 **Proposals Module**
Propostas de prestadores
- Criar e listar propostas
- Atualização de status
- **Trigger de eventos** para processamento assíncrono

### 📧 **Notifications Module** *(Lambda)*
Processamento assíncrono de notificações
```
Proposal criada → Stream → Lambda → Email (SES) + Evento (SNS)
```

### 🖼️ **Media Module** *(Lambda)*
Processamento de uploads
```
Upload → S3 → Lambda → Validação → Thumbnail → Metadata (DynamoDB)
```

---

## 🏗️ Clean Architecture

```
src/
├── modules/
│   ├── auth/
│   │   ├── presentation/          # Controllers, DTOs
│   │   ├── application/
│   │   │   └── use-cases/         # Regras de negócio
│   │   ├── domain/
│   │   │   ├── entities/          # Entidades do domínio
│   │   │   └── interfaces/        # Contratos
│   │   └── infrastructure/
│   │       ├── repositories/      # DynamoDB
│   │       └── services/          # Serviços externos
│   ├── users/
│   ├── services/
│   ├── requests/
│   ├── proposals/
│   └── media/
└── shared/
    ├── config/
    └── utils/
```

### 🎯 Princípios SOLID

| Princípio | Aplicação |
|-----------|-----------|
| **S**ingle Responsibility | Cada use-case executa apenas uma ação |
| **O**pen/Closed | Novas features = novos use-cases, sem modificar existentes |
| **L**iskov Substitution | Repositórios substituíveis via interfaces |
| **I**nterface Segregation | Interfaces pequenas e específicas |
| **D**ependency Inversion | Dependência de abstrações, não implementações |

---

<div align="center">

### Desenvolvido com ❤️ e ☕

</div>
