# 🚀 Guia de Deploy - Kubernetes

## 📋 Pré-requisitos

- Docker instalado
- Kubernetes (Minikube, Kind, K3s, ou cluster remoto)
- kubectl configurado
- Terraform instalado (opcional, para LocalStack)

## 🎯 Opções de Deploy

### 1️⃣ **Docker Compose + LocalStack** (Recomendado para início)

```bash
# Subir tudo de uma vez
docker-compose -f docker-compose.localstack.yml up -d

# Ver logs
docker-compose -f docker-compose.localstack.yml logs -f

# Parar
docker-compose -f docker-compose.localstack.yml down
```

### 2️⃣ **Kubernetes Local** (Minikube)

```bash
# Iniciar Minikube
minikube start --memory=4096 --cpus=2

# Habilitar Ingress
minikube addons enable ingress

# Deploy
./k8s/deploy.sh

# Acessar API
minikube service marketplace-api-service -n marketplace

# Ou via port-forward
kubectl port-forward svc/marketplace-api-service 3000:80 -n marketplace
```

### 3️⃣ **Kubernetes com Kind**

```bash
# Criar cluster
kind create cluster --name marketplace

# Carregar imagem
kind load docker-image marketplace-api:latest --name marketplace

# Deploy
kubectl apply -f k8s/

# Port-forward
kubectl port-forward svc/marketplace-api-service 3000:80 -n marketplace
```

## 🔧 Configuração do LocalStack com Terraform

```bash
# Entrar no diretório terraform
cd terraform

# Inicializar
terraform init

# Planejar
terraform plan

# Aplicar (após LocalStack estar rodando)
terraform apply

# Ver outputs
terraform output
```

## 📊 Monitoramento

### Ver Pods
```bash
kubectl get pods -n marketplace
```

### Ver Logs
```bash
# Logs da API
kubectl logs -f -l app=marketplace-api -n marketplace

# Logs do LocalStack
kubectl logs -f -l app=localstack -n marketplace
```

### Métricas do HPA
```bash
kubectl get hpa -n marketplace
```

### Eventos
```bash
kubectl get events -n marketplace --sort-by='.lastTimestamp'
```

## 🧪 Testar a API

```bash
# Health check
curl http://localhost:3000/health

# Swagger
open http://localhost:3000/api

# Criar serviço
curl -X POST http://localhost:3000/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Desenvolvimento Web",
    "description": "Criação de sites e aplicações web",
    "category": "Tecnologia"
  }'
```

## 🎯 Escala Manual

```bash
# Escalar para 5 réplicas
kubectl scale deployment marketplace-api --replicas=5 -n marketplace

# Ver status
kubectl get pods -n marketplace -w
```

## 🧹 Limpeza

### Docker Compose
```bash
docker-compose -f docker-compose.localstack.yml down -v
```

### Kubernetes
```bash
# Deletar tudo
kubectl delete namespace marketplace

# Ou deletar recursos específicos
kubectl delete -f k8s/
```

### Minikube
```bash
minikube delete
```

## 🐛 Troubleshooting

### Pod não inicia
```bash
kubectl describe pod <pod-name> -n marketplace
kubectl logs <pod-name> -n marketplace
```

### LocalStack não responde
```bash
# Verificar health
kubectl exec -it <localstack-pod> -n marketplace -- curl http://localhost:4566/_localstack/health

# Reiniciar
kubectl rollout restart deployment/localstack -n marketplace
```

### API não conecta no LocalStack
```bash
# Verificar DNS
kubectl exec -it <api-pod> -n marketplace -- nslookup localstack-service

# Testar conectividade
kubectl exec -it <api-pod> -n marketplace -- curl http://localstack-service:4566/_localstack/health
```

## 📈 Próximos Passos

1. **Monitoring**: Adicionar Prometheus + Grafana
2. **Logging**: ELK Stack ou Loki
3. **Service Mesh**: Istio ou Linkerd
4. **GitOps**: ArgoCD ou Flux
5. **CI/CD**: GitHub Actions + Kubernetes

## 🔗 Links Úteis

- [Kubernetes Docs](https://kubernetes.io/docs/)
- [LocalStack Docs](https://docs.localstack.cloud/)
- [Terraform AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/)
