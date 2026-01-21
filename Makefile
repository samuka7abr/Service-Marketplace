.PHONY: module help

help: ## Mostra esta mensagem de ajuda
	@printf "\033[0;36mComandos disponíveis:\033[0m\n"
	@printf "\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[0;36m%-20s\033[0m %s\n", $$1, $$2}'

module: ## Cria um novo módulo com a estrutura Clean Architecture (use: make module name=nome-do-modulo)
ifndef name
	@printf "\033[0;31m❌ Erro: Por favor, forneça o nome do módulo.\033[0m\n"
	@printf "\033[0;33mUso: make module name=<nome-do-modulo>\033[0m\n"
	@printf "\033[0;33mExemplo: make module name=chat\033[0m\n"
	@exit 1
endif
	@printf "\033[0;34m📦 Criando módulo: \033[0;36m$(name)\033[0;34m...\033[0m\n"
	@mkdir -p src/modules/$(name)/application/use-cases
	@mkdir -p src/modules/$(name)/domain/entities
	@mkdir -p src/modules/$(name)/domain/interfaces
	@mkdir -p src/modules/$(name)/infrastructure/repositories
	@mkdir -p src/modules/$(name)/infrastructure/guards
	@mkdir -p src/modules/$(name)/infrastructure/services
	@mkdir -p src/modules/$(name)/infrastructure/strategies
	@mkdir -p src/modules/$(name)/presentation/controllers
	@mkdir -p src/modules/$(name)/presentation/dto
	@touch src/modules/$(name)/$(name).module.ts
	@printf "\033[0;32m✅ Módulo '\033[0;36m$(name)\033[0;32m' criado com sucesso!\033[0m\n"
	@printf "\n"
	@printf "\033[0;36mEstrutura criada:\033[0m\n"
	@tree src/modules/$(name) 2>/dev/null || find src/modules/$(name) -print | sed -e 's;[^/]*/;|____;g;s;____|;  |;g'
