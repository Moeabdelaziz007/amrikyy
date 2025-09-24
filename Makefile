# AuraOS Makefile
# Development and deployment commands

.PHONY: help install dev test lint format clean build deploy

# Default target
help: ## Show this help message
	@echo "AuraOS Development Commands"
	@echo "=========================="
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Installation
install: ## Install dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -r requirements-dev.txt

install-prod: ## Install production dependencies
	pip install -r requirements-prod.txt

# Development
dev: ## Start development environment
	docker-compose up -d redis prometheus grafana
	@echo "Development environment started. Access:"
	@echo "  - Grafana: http://localhost:3000 (admin/admin)"
	@echo "  - Prometheus: http://localhost:9090"

dev-services: ## Start all services in development
	docker-compose up -d

dev-stop: ## Stop development environment
	docker-compose down

# Testing
test: ## Run tests
	pytest

test-cov: ## Run tests with coverage
	pytest --cov=auraos --cov-report=html --cov-report=term

test-watch: ## Run tests in watch mode
	pytest-watch

# Code Quality
lint: ## Run linting
	flake8 auraos tests
	mypy auraos
	bandit -r auraos

format: ## Format code
	black auraos tests
	isort auraos tests

format-check: ## Check code formatting
	black --check auraos tests
	isort --check-only auraos tests

# Security
security: ## Run security checks
	bandit -r auraos
	safety check

# Database
db-migrate: ## Run database migrations
	alembic upgrade head

db-revision: ## Create new migration
	alembic revision --autogenerate -m "$(message)"

db-reset: ## Reset database
	alembic downgrade base
	alembic upgrade head

# Docker
build: ## Build Docker images
	docker-compose build

build-prod: ## Build production Docker images
	docker-compose -f docker-compose.production.yml build

# Deployment
deploy: ## Deploy to staging
	@echo "Deploying to staging..."
	# Add deployment commands here

deploy-prod: ## Deploy to production
	@echo "Deploying to production..."
	# Add production deployment commands here

# Firebase
firebase-deploy: ## Deploy to Firebase
	firebase deploy

firebase-hosting: ## Deploy hosting to Firebase
	firebase deploy --only hosting

firebase-functions: ## Deploy functions to Firebase
	firebase deploy --only functions

# Monitoring
logs: ## View logs
	docker-compose logs -f

logs-service: ## View logs for specific service
	docker-compose logs -f $(service)

# Cleanup
clean: ## Clean up temporary files
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf build/
	rm -rf dist/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/

clean-docker: ## Clean up Docker resources
	docker-compose down -v
	docker system prune -f

# Setup
setup: install-dev ## Initial setup
	cp env.example .env
	@echo "Please edit .env file with your configuration"
	pre-commit install

setup-prod: install-prod ## Production setup
	cp env.example .env
	@echo "Please edit .env file with your production configuration"

# Documentation
docs: ## Generate documentation
	mkdocs serve

docs-build: ## Build documentation
	mkdocs build

# Performance
benchmark: ## Run performance benchmarks
	pytest --benchmark-only

profile: ## Profile application
	python -m cProfile -o profile.stats main.py

# Utilities
shell: ## Start Python shell
	python -c "import auraos; import IPython; IPython.embed()"

notebook: ## Start Jupyter notebook
	jupyter notebook

# Service Management
start-conversational: ## Start conversational core service
	cd services/templates/conversational-core && python run.py

start-file-organizer: ## Start file organizer service
	cd services/templates/file-organizer && python run.py

start-ide-agent: ## Start IDE agent service
	cd services/templates/ide-agent && python run.py

# Health Checks
health: ## Check service health
	curl -f http://localhost:8001/health || echo "Conversational Core: DOWN"
	curl -f http://localhost:8002/health || echo "File Organizer: DOWN"
	curl -f http://localhost:8003/health || echo "IDE Agent: DOWN"

# Backup
backup: ## Backup data
	@echo "Creating backup..."
	# Add backup commands here

restore: ## Restore data
	@echo "Restoring data..."
	# Add restore commands here
