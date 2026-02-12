#!/bin/bash

echo "🧹 Limpando recursos do Kubernetes..."

# Deletar namespace (isso remove tudo)
kubectl delete namespace marketplace

# Aguardar conclusão
echo "⏳ Aguardando remoção completa..."
kubectl wait --for=delete namespace/marketplace --timeout=60s

echo "✅ Limpeza concluída!"
