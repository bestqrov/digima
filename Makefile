# ArwaPark Development & Deployment Makefile

.PHONY: help install dev build start stop restart logs clean deploy health

# Default target
help: ## Show this help message
	@echo "ArwaPark - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Development commands
install: ## Install dependencies
	npm install

dev: ## Start development server with database
	docker-compose -f docker-compose.dev.yml up -d
	npm run start:dev

dev-db: ## Start only development database
	docker-compose -f docker-compose.dev.yml up -d

dev-stop: ## Stop development database
	docker-compose -f docker-compose.dev.yml down

# Build commands
build: ## Build the application for production
	npm run build

build-docker: ## Build Docker image
	docker build -t arwa-park:latest .

# Production commands  
start: ## Start production services
	docker-compose up -d

stop: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-api: ## View only API logs
	docker-compose logs -f arwa-park-api

logs-db: ## View only database logs
	docker-compose logs -f mongodb

# Health and monitoring
health: ## Check service health
	curl -f http://localhost:3000/health || echo "Service is down"

# Maintenance commands
clean: ## Clean up Docker resources
	docker system prune -f
	docker volume prune -f

clean-all: ## Clean up all Docker resources (including volumes)
	docker-compose down -v
	docker system prune -a -f

# Database commands
db-backup: ## Backup production database
	docker exec arwa-park-mongo mongodump --out /tmp/backup
	docker cp arwa-park-mongo:/tmp/backup ./backups/$(shell date +%Y%m%d_%H%M%S)

db-restore: ## Restore database from backup (usage: make db-restore BACKUP_DIR=backup_directory)
	docker cp ./backups/$(BACKUP_DIR) arwa-park-mongo:/tmp/restore
	docker exec arwa-park-mongo mongorestore /tmp/restore

# Security
update-deps: ## Update dependencies and check for vulnerabilities
	npm audit fix
	npm update

# Deployment helpers
deploy-staging: ## Deploy to staging environment
	@echo "Deploying to staging..."
	docker-compose -f docker-compose.yml -f docker-compose.staging.yml up -d

deploy-prod: ## Deploy to production environment
	@echo "Deploying to production..."
	@echo "Make sure you have updated .env.production with proper values!"
	docker-compose -f docker-compose.yml up -d

# Quick setup for new developers
setup: ## Complete project setup for new developers
	@echo "Setting up ArwaPark development environment..."
	npm install
	cp .env.example .env
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Setup complete! Run 'make dev' to start development server."
	@echo "Don't forget to update .env with your configuration."