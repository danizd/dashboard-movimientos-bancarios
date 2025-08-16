@echo off
REM Script de despliegue Docker para Windows - Dashboard Financiero Personal
REM Automatiza el proceso de build y despliegue en Windows

setlocal enabledelayedexpansion

REM Configuración
set IMAGE_NAME=dashboard-financiero
set VERSION=2.1.0
set CONTAINER_NAME=dashboard-financiero
set PORT=3000

REM Colores para output (limitados en CMD)
set "COLOR_RESET=[0m"
set "COLOR_GREEN=[32m"
set "COLOR_RED=[31m"
set "COLOR_YELLOW=[33m"
set "COLOR_BLUE=[34m"

REM Función para mostrar ayuda
:show_help
echo.
echo 📊 Dashboard Financiero Personal - Script de Despliegue Docker para Windows
echo.
echo Uso: %~nx0 [COMANDO]
echo.
echo Comandos disponibles:
echo   build          Construir imagen Docker
echo   run            Ejecutar contenedor
echo   stop           Parar contenedor
echo   restart        Reiniciar contenedor
echo   logs           Mostrar logs del contenedor
echo   clean          Limpiar imagenes y contenedores no utilizados
echo   status         Mostrar estado del contenedor
echo   deploy         Build completo y despliegue
echo   help           Mostrar esta ayuda
echo.
echo Ejemplos:
echo   %~nx0 deploy      # Build y despliegue completo
echo   %~nx0 logs        # Ver logs en tiempo real
echo   %~nx0 restart     # Reiniciar aplicacion
echo.
goto :eof

REM Verificar si Docker está instalado
:check_docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no esta instalado. Por favor instala Docker Desktop primero.
    exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker no esta ejecutandose. Por favor inicia Docker Desktop.
    exit /b 1
)

echo ✅ Docker esta disponible y funcionando
goto :eof

REM Construir imagen Docker
:build_image
echo 🏗️  Construyendo imagen Docker...

if not exist "Dockerfile" (
    echo ❌ Dockerfile no encontrado en el directorio actual
    exit /b 1
)

REM Build con múltiples tags
docker build -t "%IMAGE_NAME%:latest" -t "%IMAGE_NAME%:%VERSION%" .
if errorlevel 1 (
    echo ❌ Error al construir la imagen
    exit /b 1
)

echo ✅ Imagen construida exitosamente: %IMAGE_NAME%:%VERSION%
goto :eof

REM Parar contenedor existente
:stop_container
docker ps -q -f name="%CONTAINER_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo 🛑 Parando contenedor existente...
    docker stop "%CONTAINER_NAME%" >nul 2>&1
    docker rm "%CONTAINER_NAME%" >nul 2>&1
    echo ✅ Contenedor parado y eliminado
) else (
    echo ⚠️  No hay contenedor ejecutandose con el nombre %CONTAINER_NAME%
)
goto :eof

REM Ejecutar contenedor
:run_container
echo 🚀 Ejecutando contenedor...

call :stop_container

REM Ejecutar nuevo contenedor
docker run -d --name "%CONTAINER_NAME%" --restart unless-stopped -p "%PORT%:80" "%IMAGE_NAME%:latest"
if errorlevel 1 (
    echo ❌ Error al ejecutar el contenedor
    exit /b 1
)

echo ✅ Contenedor ejecutandose en http://localhost:%PORT%

REM Esperar a que el contenedor esté listo
echo ⏳ Esperando a que la aplicacion este lista...
timeout /t 5 /nobreak >nul

REM Verificar estado
docker ps -f name="%CONTAINER_NAME%" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | findstr "%CONTAINER_NAME%" >nul
if not errorlevel 1 (
    echo ✨ Dashboard disponible en http://localhost:%PORT%
) else (
    echo ❌ Error al iniciar el contenedor
    docker logs "%CONTAINER_NAME%"
    exit /b 1
)
goto :eof

REM Mostrar logs
:show_logs
docker ps -q -f name="%CONTAINER_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo 📋 Mostrando logs del contenedor (Ctrl+C para salir)...
    docker logs -f "%CONTAINER_NAME%"
) else (
    echo ❌ Contenedor %CONTAINER_NAME% no esta ejecutandose
    exit /b 1
)
goto :eof

REM Limpiar recursos Docker
:clean_docker
echo 🧹 Limpiando recursos Docker no utilizados...

REM Limpiar contenedores parados
docker container prune -f >nul 2>&1

REM Limpiar imágenes no utilizadas
docker image prune -f >nul 2>&1

echo ✅ Limpieza completada
goto :eof

REM Mostrar estado
:show_status
echo 📊 Estado del Dashboard Financiero:
echo.

REM Estado del contenedor
docker ps -q -f name="%CONTAINER_NAME%" >nul 2>&1
if not errorlevel 1 (
    echo 🟢 Contenedor: EJECUTANDOSE
    docker ps -f name="%CONTAINER_NAME%" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo.
    echo 📦 Informacion de la imagen:
    docker images "%IMAGE_NAME%" --format "table {{.Tag}}\t{{.Size}}\t{{.CreatedSince}}"
) else (
    echo 🔴 Contenedor: NO EJECUTANDOSE
)

echo.
echo 🐳 Version de Docker:
docker version --format "Version: {{.Server.Version}}"
goto :eof

REM Despliegue completo
:deploy
echo 🚀 Iniciando despliegue completo del Dashboard Financiero...

call :check_docker
if errorlevel 1 exit /b 1

call :build_image
if errorlevel 1 exit /b 1

call :run_container
if errorlevel 1 exit /b 1

echo.
echo 🎉 ¡Despliegue completado exitosamente!
echo.
echo 📍 Dashboard disponible en: http://localhost:%PORT%
echo 📋 Ver logs: %~nx0 logs
echo 🛑 Parar: %~nx0 stop
echo 🔄 Reiniciar: %~nx0 restart
goto :eof

REM Procesamiento de comandos
if "%1"=="build" (
    call :check_docker
    if not errorlevel 1 call :build_image
) else if "%1"=="run" (
    call :check_docker
    if not errorlevel 1 call :run_container
) else if "%1"=="stop" (
    call :stop_container
) else if "%1"=="restart" (
    call :check_docker
    if not errorlevel 1 (
        call :stop_container
        call :run_container
    )
) else if "%1"=="logs" (
    call :show_logs
) else if "%1"=="clean" (
    call :clean_docker
) else if "%1"=="status" (
    call :show_status
) else if "%1"=="deploy" (
    call :deploy
) else if "%1"=="help" (
    call :show_help
) else if "%1"=="" (
    call :show_help
) else (
    echo ❌ Comando desconocido: %1
    echo.
    call :show_help
    exit /b 1
)
