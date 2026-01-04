#!/bin/sh

echo "Aguardando DynamoDB ficar pronto..."
sleep 5

echo "Criando tabela Marketplace..."
npx ts-node /app/scripts/create-table.ts

echo "Inicialização concluída!"
