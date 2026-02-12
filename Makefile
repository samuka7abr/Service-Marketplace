.PHONY: help install dev-docker dev-k8s build test clean terraform-init terraform-apply k8s-deploy k8s-clean

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-20s %s\n", $$1, $$2}'

install: ## Instalar dependências
	npm install

# Docker Compose
dev-docker: ## Iniciar com Docker Compose + LocalStack
	docker-compose up -d

dev-docker-logs: ## Ver logs do Docker Compose
	docker-compose logs -f

dev-docker-down: ## Parar Docker Compose
	docker-compose down

dev-docker-clean: ## Parar e limpar volumes do Docker
	docker-compose down -v

# Terraform
terraform-init: ## Inicializar Terraform
	cd terraform && terraform init

terraform-plan: ## Planejar infraestrutura
	cd terraform && terraform plan

terraform-apply: ## Aplicar infraestrutura
	cd terraform && terraform apply -auto-approve

terraform-destroy: ## Destruir infraestrutura
	cd terraform && terraform destroy -auto-approve

terraform-output: ## Ver outputs do Terraform
	cd terraform && terraform output

# Kubernetes
k8s-deploy: ## Deploy completo no Kubernetes
	./k8s/deploy.sh

k8s-status: ## Ver status dos pods
	kubectl get all -n marketplace

k8s-logs: ## Ver logs da API no Kubernetes
	kubectl logs -f -l app=marketplace-api -n marketplace

k8s-logs-localstack: ## Ver logs do LocalStack
	kubectl logs -f -l app=localstack -n marketplace

k8s-scale: ## Escalar API manualmente (ex: make k8s-scale REPLICAS=5)
	kubectl scale deployment marketplace-api --replicas=$(REPLICAS) -n marketplace

k8s-hpa-status: ## Ver status do HPA
	kubectl get hpa -n marketplace

k8s-port-forward: ## Port-forward para acessar localmente
	kubectl port-forward svc/marketplace-api-service 3000:80 -n marketplace

k8s-clean: ## Limpar recursos do Kubernetes
	./k8s/cleanup.sh

k8s-restart: ## Reiniciar deployment da API
	kubectl rollout restart deployment/marketplace-api -n marketplace

# Build & Test
build: ## Build da aplicação
	npm run build

build-docker: ## Build da imagem Docker
	docker build -t marketplace-api:latest .

test: ## Executar testes
	npm test

test-watch: ## Executar testes em modo watch
	npm run test:watch

test-cov: ## Executar testes com cobertura
	npm run test:cov

lint: ## Executar linter
	npm run lint

format: ## Formatar código
	npm run format

# Development
dev: ## Modo desenvolvimento (sem Docker)
	npm run start:dev

debug: ## Modo debug
	npm run start:debug

# Utilities
health: ## Verificar health da API
	@curl -s http://localhost:3000/health | jq '.' || echo "API não está respondendo"

swagger: ## Abrir documentação Swagger
	@xdg-open http://localhost:3000/api 2>/dev/null || open http://localhost:3000/api 2>/dev/null || echo "http://localhost:3000/api"

clean: ## Limpar node_modules e builds
	rm -rf node_modules dist coverage

setup: install build ## Setup completo do projeto

# Minikube
minikube-start: ## Iniciar Minikube
	minikube start --memory=4096 --cpus=2
	minikube addons enable ingress

minikube-stop: ## Parar Minikube
	minikube stop

minikube-delete: ## Deletar Minikube
	minikube delete

minikube-dashboard: ## Abrir dashboard do Minikube
	minikube dashboard

minikube-service: ## Abrir serviço no Minikube
	minikube service marketplace-api-service -n marketplace

# Aliases
up: dev-docker
down: dev-docker-down
logs: dev-docker-logs
restart: down up