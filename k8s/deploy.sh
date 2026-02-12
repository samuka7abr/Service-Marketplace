#!/bin/bash
set -e

echo "Iniciando deployment no Kubernetes..."

kubectl apply -f k8s/namespace.yaml

kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

kubectl apply -f k8s/localstack-deployment.yaml

echo "Aguardando LocalStack..."
kubectl wait --for=condition=ready pod -l app=localstack -n marketplace --timeout=120s

docker build -t marketplace-api:latest .

if command -v minikube &> /dev/null; then
    minikube image load marketplace-api:latest
fi

kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/ingress.yaml

echo "Aguardando pods da API..."
kubectl wait --for=condition=ready pod -l app=marketplace-api -n marketplace --timeout=180s

echo "Deployment concluído."
echo ""
kubectl get pods -n marketplace
echo ""
kubectl get services -n marketplace