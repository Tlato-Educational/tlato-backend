## Include .env file
include .env

## Root directory
ROOT_DIR := $(shell dirname $(realpath $(lastword $(MAKEFILE_LIST))))

## Set 'bash' as default shell
SHELL := $(shell which bash)

## Set 'help' target as the default goal
.DEFAULT_GOAL := help

## Test if the dependencies we need to run this Makefile are installed
DOCKER := DOCKER_BUILDKIT=1 $(shell command -v docker)
DOCKER_COMPOSE := COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 $(shell command -v docker-compose)
DOCKER_COMPOSE_FILE := $(ROOT_DIR)/docker/docker-compose.yml
BUN := $(shell command -v bun)

.PHONY: help
help: ## Show this help
	@egrep -h '^[a-zA-Z0-9_\/-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort -d | awk 'BEGIN {FS = ":.*?## "; printf "Usage: make \033[0;34mTARGET\033[0m \033[0;35m[ARGUMENTS]\033[0m\n\n"; printf "Targets:\n"}; {printf "  \033[33m%-25s\033[0m \033[0;32m%s\033[0m\n", $$1, $$2}'

.PHONY: requirements
requirements: ## Check if the requirements are satisfied
ifndef DOCKER
	@echo "🐳 Docker is not available. Please install docker."
	@exit 1
endif
ifndef DOCKER_COMPOSE
	@echo "🐳🧩 docker-compose is not available. Please install docker-compose."
	@exit 1
endif
ifndef BUN
	@echo "🧩 Bun is not available. Please install Bun using 'curl -fsSL https://bun.sh/install | bash'"
	@exit 1
endif
	@echo "🆗 The necessary dependencies are already installed!"

TAG ?= prod

.PHONY: install
install: requirements ## Install the project
	@echo "🍿 Installing dependencies..."
	@bun install
	@bun run prisma:generate

.PHONY: start
start: install ## Start application in development mode
	@echo "▶️ Starting app in development mode..."
	@bun run dev

.PHONY: start/docker/db
start/docker/db: ## Start database container
	@echo "▶️ Starting database (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env up -d tlato-backend-postgres tlato-backend-pgweb

.PHONY: stop/docker/db
stop/docker/db: ## Stop database container
	@echo "🛑 Stopping database (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env stop tlato-backend-postgres tlato-backend-pgweb

.PHONY: start/docker/cache
start/docker/cache: ## Start cache container
	@echo "▶️ Starting cache (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env up -d tlato-backend-redis tlato-backend-redis-commander

.PHONY: stop/docker/cache
stop/docker/cache: ## Stop cache container
	@echo "🛑 Stopping cache (Docker)..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env stop tlato-backend-redis tlato-backend-redis-commander

.PHONY: start/docker
start/docker: ## Start application in a Docker container
	@echo "▶️ Starting app in production mode (Docker)..."
	@mkdir -p -m 755 ${LOGS_VOLUME}
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env up -d --build

.PHONY: stop/docker
stop/docker: ## Stop application running in a Docker container
	@echo "🛑 Stopping app..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env down

.PHONY: clean/docker
clean/docker: ## Clean all container resources
	@echo "🧼 Cleaning all resources..."
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env down --rmi local --volumes --remove-orphans

.PHONY: build/docker
build/docker: ## Build Docker image of the application
	@echo "📦 Building project Docker image..."
	@docker build --build-arg PORT=$(PORT) -t $(APP_NAME):$(TAG) -f ./docker/Dockerfile .

.PHONY: logs
logs: ## Show logs for all or c=<name> containers
	@$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) --env-file .env logs --tail=100 -f $(c)
