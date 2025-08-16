# Scripts de Docker para Dashboard Financiero Personal

# Construir la imagen Docker
build:
	docker build -t dashboard-financiero:latest .

# Construir con etiquetas de versión
build-versioned:
	docker build -t dashboard-financiero:2.1.0 -t dashboard-financiero:latest .

# Ejecutar usando docker-compose (recomendado)
up:
	docker-compose up -d

# Ejecutar en modo desarrollo (con logs)
up-dev:
	docker-compose up

# Parar los contenedores
down:
	docker-compose down

# Parar y eliminar volúmenes
down-volumes:
	docker-compose down -v

# Reconstruir y ejecutar
rebuild:
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d

# Ejecutar solo con Docker (sin compose)
run-docker:
	docker run -d -p 3000:80 --name dashboard-financiero dashboard-financiero:latest

# Parar contenedor Docker directo
stop-docker:
	docker stop dashboard-financiero
	docker rm dashboard-financiero

# Ver logs
logs:
	docker-compose logs -f dashboard

# Limpiar imágenes no utilizadas
clean:
	docker system prune -f
	docker image prune -f

# Ver estado de contenedores
status:
	docker-compose ps

# Ejecutar shell en el contenedor
shell:
	docker-compose exec dashboard sh

# Mostrar ayuda
help:
	@echo "Comandos disponibles:"
	@echo "  build          - Construir imagen Docker"
	@echo "  build-versioned - Construir con etiquetas de versión"
	@echo "  up             - Ejecutar con docker-compose (modo daemon)"
	@echo "  up-dev         - Ejecutar con logs visibles"
	@echo "  down           - Parar contenedores"
	@echo "  down-volumes   - Parar y eliminar volúmenes"
	@echo "  rebuild        - Reconstruir y ejecutar"
	@echo "  run-docker     - Ejecutar solo con Docker"
	@echo "  stop-docker    - Parar contenedor Docker directo"
	@echo "  logs           - Ver logs en tiempo real"
	@echo "  clean          - Limpiar imágenes no utilizadas"
	@echo "  status         - Ver estado de contenedores"
	@echo "  shell          - Acceder al contenedor"
	@echo "  help           - Mostrar esta ayuda"

.PHONY: build build-versioned up up-dev down down-volumes rebuild run-docker stop-docker logs clean status shell help
