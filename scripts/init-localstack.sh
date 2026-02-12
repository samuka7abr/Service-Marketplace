#!/bin/bash

echo "🚀 Iniciando configuração do LocalStack..."

# Aguardar LocalStack estar pronto
until curl -s http://localhost:4566/_localstack/health | grep -q '"dynamodb": "available"'; do
    echo "⏳ Aguardando LocalStack ficar pronto..."
    sleep 2
done

echo "✅ LocalStack está pronto!"

# Criar bucket S3
echo "📦 Criando bucket S3..."
awslocal s3 mb s3://marketplace-bucket
awslocal s3api put-bucket-cors --bucket marketplace-bucket --cors-configuration '{
  "CORSRules": [{
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"]
  }]
}'

echo "✅ Bucket S3 criado!"

# Configurar SES
echo "📧 Configurando SES..."
awslocal ses verify-email-identity --email-address noreply@marketplace.local
awslocal ses verify-email-identity --email-address admin@marketplace.local

echo "✅ Emails verificados no SES!"

echo "🎉 LocalStack configurado com sucesso!"
