<div align="center">

# 🛍️ Service Marketplace API

### *Plataforma completa e escalável para conectar clientes e prestadores de serviços*

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![DynamoDB](https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![S3](https://img.shields.io/badge/Amazon_S3-569A31?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=for-the-badge&logo=kubernetes&logoColor=white)](https://kubernetes.io/)
[![Terraform](https://img.shields.io/badge/Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white)](https://www.terraform.io/)


</div>

---

## 📋 Sobre o Projeto

**Service Marketplace** é uma API REST production-ready que simula um marketplace completo de serviços, onde **clientes** criam solicitações e **prestadores** enviam propostas competitivas. O projeto demonstra práticas avançadas de arquitetura de software, integrando serviços AWS locais (via LocalStack) e preparado para deploy em Kubernetes.

### ✨ Destaques

- 🏗️ **Clean Architecture** com separação clara de camadas (Domain, Application, Infrastructure, Presentation)
- 🎯 **Princípios SOLID** aplicados rigorosamente em todos os módulos
- ☁️ **Infrastructure as Code** com Terraform
- 📦 **Upload de Arquivos** para S3 com Presigned URLs
- 🔔 **Sistema de Notificações** preparado (SNS + SES)
- 🐳 **LocalStack** completo para desenvolvimento local
- ☸️ **Kubernetes-ready** com manifests completos e auto-scaling
- 🚀 **Docker Compose** para setup rápido

---

## 🏛️ Arquitetura

### Stack Tecnológica

<div align="center">

| Backend | Database | Storage | Messaging | DevOps |
|:-------:|:--------:|:-------:|:---------:|:------:|
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nestjs/nestjs-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dynamodb/dynamodb-original.svg" width="50"/> | <img src="https://upload.wikimedia.org/wikipedia/commons/b/bc/Amazon-S3-Logo.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" width="50"/> |
| NestJS | DynamoDB | Amazon S3 | SNS + SES | Docker |
| <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/kubernetes/kubernetes-plain.svg" width="50"/> | <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="50"/> |
| TypeScript | LocalStack | Terraform | Kubernetes | Node.js |

</div>

### 🎯 Arquitetura de Serviços

```mermaid
graph TB
    subgraph "Client Layer"
        A[API Gateway / Ingress]
    end
    
    subgraph "Application Layer"
        B[NestJS API]
        B1[Auth Module]
        B2[Services Module]
        B3[Requests Module]
        B4[Proposals Module]
        B5[Media Module]
    end
    
    subgraph "Infrastructure Layer - LocalStack"
        C[DynamoDB]
        D[S3 Bucket]
        E[SNS Topics]
        F[SES]
    end
    
    A --> B
    B --> B1
    B --> B2
    B --> B3
    B --> B4
    B --> B5
    
    B1 --> C
    B2 --> C
    B3 --> C
    B4 --> C
    B5 --> C
    B5 --> D
    
    B3 -.->|Events| E
    B4 -.->|Events| E
    E -.->|Notifications| F
    
    style B fill:#e0234e
    style C fill:#4053d6
    style D fill:#569a31
    style E fill:#ff9900
    style F fill:#dd344c
```

---

## 🧩 Módulos Implementados

### 🔐 **Auth Module** ✅
Autenticação e autorização com JWT
- Login/Register com bcrypt
- Refresh Token
- JWT Strategy com Passport
- Guards para proteção de rotas

### 👥 **Users Module** ✅
Gerenciamento completo de usuários
- Criação de contas (CLIENT/PROVIDER)
- CRUD completo com validação
- Perfis diferenciados por tipo
- Integração com Auth

### 🛠️ **Services Module** ✅
Catálogo de serviços do marketplace
- CRUD completo de serviços
- Categorização e busca
- Serviços ativos/inativos
- Validação de unicidade de nome

### 📝 **Requests Module** ✅
Solicitações de clientes
- Criar e gerenciar solicitações
- Status tracking: `OPEN` → `IN_NEGOTIATION` → `CLOSED` → `CANCELLED`
- Busca por cliente, serviço e status
- Query otimizada via GSI1 e GSI2

### 💼 **Proposals Module** ✅
Propostas de prestadores
- Criar e listar propostas
- Status: `PENDING` → `ACCEPTED` / `REJECTED` / `WITHDRAWN`
- Busca por request e provider
- Relacionamento N:1 com Requests

### 🖼️ **Media Module** ✅
Upload e gerenciamento de arquivos
- Upload para S3 com validação
- Presigned URLs temporárias
- Suporte: Imagens, PDFs, Vídeos, Áudio
- Hash SHA256 e metadata
- Paginação com cursor
- Associação com Requests

### 📧 **Notifications Module** ✅
Sistema de notificações (preparado)
- SNS Topics configurados
- Templates SES para emails
- Eventos: Nova proposta, Request criado
- Pronto para Lambda triggers

---

## 🏗️ Clean Architecture

```
src/
├── modules/
│   ├── auth/                      # ✅ Autenticação JWT
│   │   ├── presentation/          # Controllers, DTOs, Guards
│   │   ├── application/
│   │   │   └── use-cases/         # Login, Register, Refresh
│   │   ├── domain/
│   │   │   ├── entities/          # Token Payload
│   │   │   └── interfaces/        # Token Service
│   │   └── infrastructure/
│   │       ├── strategies/        # JWT Strategy
│   │       └── services/          # Token Service
│   │
│   ├── users/                     # ✅ Gerenciamento de usuários
│   ├── services/                  # ✅ Catálogo de serviços
│   ├── requests/                  # ✅ Solicitações
│   ├── proposals/                 # ✅ Propostas
│   └── media/                     # ✅ Upload de arquivos
│       ├── domain/
│       │   ├── entities/          # Media
│       │   └── interfaces/        # S3 Service, Repository
│       ├── infrastructure/
│       │   ├── services/
│       │   │   ├── s3.service.ts           # ✅ AWS S3
│       │   │   └── validation.service.ts   # ✅ File validation
│       │   └── repositories/
│       └── application/use-cases/
│           ├── upload-media.use-case.ts    # ✅ Upload + Hash
│           ├── list-media.use-case.ts      # ✅ Paginação
│           └── delete-media.use-case.ts    # ✅ Delete S3 + DB
│
├── database/                      # ✅ DynamoDB config
└── shared/                        # Config, Utils

Total: 6 módulos completos, 50+ arquivos
```

### 🎯 Princípios SOLID Aplicados

| Princípio | Aplicação no Projeto |
|-----------|---------------------|
| **S**ingle Responsibility | Cada use-case tem UMA responsabilidade (ex: UploadMediaUseCase) |
| **O**pen/Closed | Novos módulos são extensões, código existente não é modificado |
| **L**iskov Substitution | Repositórios implementam interfaces e são intercambiáveis |
| **I**nterface Segregation | Interfaces específicas (IMediaRepository, IS3Service) |
| **D**ependency Inversion | Dependemos de abstrações (interfaces), não implementações |


---

## 🌟 Funcionalidades Avançadas

- ✅ **Auto-scaling horizontal** no Kubernetes
- ✅ **Health checks** e self-healing
- ✅ **Presigned URLs** para acesso seguro ao S3
- ✅ **Paginação com cursor** (lastKey)
- ✅ **Validação de arquivos** (tipo, tamanho, extensão)
- ✅ **Hash SHA256** para integridade de arquivos
- ✅ **Rollback automático** em falhas de upload
- ✅ **Infrastructure as Code** (Terraform)
- ✅ **Service discovery** no Kubernetes
- ✅ **Load balancing** automático


---

<div align="center">

### Desenvolvido com ❤️ e ☕

**Service Marketplace** - Um projeto completo demonstrando Clean Architecture, AWS Services e Kubernetes

⭐ Se este projeto foi útil, deixe uma estrela!

</div>
