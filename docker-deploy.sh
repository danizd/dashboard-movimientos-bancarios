#!/bin/bash

# Script de despliegue Docker para Dashboard Financiero Personal
# Automatiza el proceso de build y despliegue

set -e  # Salir si algún comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️  $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌ $1${NC}"
}

# Configuración
IMAGE_NAME="dashboard-financiero"
VERSION="2.1.0"
CONTAINER_NAME="dashboard-financiero"
PORT="3000"

# Función de ayuda
show_help() {
    echo "📊 Dashboard Financiero Personal - Script de Despliegue Docker"
    echo ""
    echo "Uso: $0 [COMANDO]"
    echo ""
    echo "Comandos disponibles:"
    echo "  build          Construir imagen Docker"
    echo "  run            Ejecutar contenedor"
    echo "  stop           Parar contenedor"
    echo "  restart        Reiniciar contenedor"
    echo "  logs           Mostrar logs del contenedor"
    echo "  shell          Acceder al shell del contenedor"
    echo "  clean          Limpiar imágenes y contenedores no utilizados"
    echo "  status         Mostrar estado del contenedor"
    echo "  deploy         Build completo y despliegue"
    echo "  help           Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 deploy      # Build y despliegue completo"
    echo "  $0 logs        # Ver logs en tiempo real"
    echo "  $0 restart     # Reiniciar aplicación"
}

# Verificar si Docker está instalado
check_docker() {
    if ! command -v docker &> /dev/null; then
        error "Docker no está instalado. Por favor instala Docker primero."
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        error "Docker no está ejecutándose. Por favor inicia Docker."
        exit 1
    fi
    
    success "Docker está disponible y funcionando"
}

# Construir imagen Docker
build_image() {
    log "🏗️  Construyendo imagen Docker..."
    
    # Verificar si existe Dockerfile
    if [ ! -f "Dockerfile" ]; then
        error "Dockerfile no encontrado en el directorio actual"
        exit 1
    fi
    
    # Build con múltiples tags
    docker build \
        -t "$IMAGE_NAME:latest" \
        -t "$IMAGE_NAME:$VERSION" \
        -t "$IMAGE_NAME:$(date +%Y%m%d)" \
        .
    
    success "Imagen construida exitosamente: $IMAGE_NAME:$VERSION"
}

# Parar contenedor existente
stop_container() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log "🛑 Parando contenedor existente..."
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
        success "Contenedor parado y eliminado"
    else
        warning "No hay contenedor ejecutándose con el nombre $CONTAINER_NAME"
    fi
}

# Ejecutar contenedor
run_container() {
    log "🚀 Ejecutando contenedor..."
    
    # Parar contenedor existente si existe
    stop_container
    
    # Ejecutar nuevo contenedor
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "$PORT:80" \
        --health-cmd="wget --quiet --tries=1 --spider http://localhost:80 || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=3 \
        --health-start-period=40s \
        "$IMAGE_NAME:latest"
    
    success "Contenedor ejecutándose en http://localhost:$PORT"
    
    # Esperar a que el contenedor esté healthy
    log "⏳ Esperando a que la aplicación esté lista..."
    sleep 5
    
    # Verificar estado
    if docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "$CONTAINER_NAME"; then
        success "✨ Dashboard disponible en http://localhost:$PORT"
    else
        error "Error al iniciar el contenedor"
        docker logs "$CONTAINER_NAME"
        exit 1
    fi
}

# Mostrar logs
show_logs() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log "📋 Mostrando logs del contenedor (Ctrl+C para salir)..."
        docker logs -f "$CONTAINER_NAME"
    else
        error "Contenedor $CONTAINER_NAME no está ejecutándose"
        exit 1
    fi
}

# Acceder al shell
access_shell() {
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log "🐚 Accediendo al shell del contenedor..."
        docker exec -it "$CONTAINER_NAME" sh
    else
        error "Contenedor $CONTAINER_NAME no está ejecutándose"
        exit 1
    fi
}

# Limpiar recursos Docker
clean_docker() {
    log "🧹 Limpiando recursos Docker no utilizados..."
    
    # Limpiar contenedores parados
    docker container prune -f
    
    # Limpiar imágenes no utilizadas
    docker image prune -f
    
    # Limpiar redes no utilizadas
    docker network prune -f
    
    success "Limpieza completada"
}

# Mostrar estado
show_status() {
    log "📊 Estado del Dashboard Financiero:"
    echo ""
    
    # Estado del contenedor
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        echo "🟢 Contenedor: EJECUTÁNDOSE"
        docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        
        # Health check
        HEALTH=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")
        echo "💚 Health Status: $HEALTH"
        echo ""
        
        # Información de la imagen
        IMAGE_ID=$(docker inspect --format='{{.Image}}' "$CONTAINER_NAME")
        docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedSince}}" | grep "$IMAGE_NAME" | head -1
        
    else
        echo "🔴 Contenedor: NO EJECUTÁNDOSE"
    fi
    
    # Información del sistema
    echo ""
    echo "🐳 Información Docker:"
    docker version --format "Version: {{.Server.Version}}"
    echo "📦 Imágenes disponibles:"
    docker images "$IMAGE_NAME" --format "table {{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
}

# Despliegue completo
deploy() {
    log "🚀 Iniciando despliegue completo del Dashboard Financiero..."
    
    check_docker
    build_image
    run_container
    
    echo ""
    success "🎉 ¡Despliegue completado exitosamente!"
    echo ""
    echo "📍 Dashboard disponible en: http://localhost:$PORT"
    echo "📋 Ver logs: $0 logs"
    echo "🛑 Parar: $0 stop"
    echo "🔄 Reiniciar: $0 restart"
}

# Procesar comando
case "${1:-help}" in
    "build")
        check_docker
        build_image
        ;;
    "run")
        check_docker
        run_container
        ;;
    "stop")
        stop_container
        ;;
    "restart")
        check_docker
        stop_container
        run_container
        ;;
    "logs")
        show_logs
        ;;
    "shell")
        access_shell
        ;;
    "clean")
        clean_docker
        ;;
    "status")
        show_status
        ;;
    "deploy")
        deploy
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        error "Comando desconocido: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
