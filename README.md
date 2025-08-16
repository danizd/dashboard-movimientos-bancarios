# 📊 Dashboard Financiero Personal

Una aplicación web moderna y completa para el análisis de finanzas personales construida con React, TypeScript y Mantine UI. Permite cargar, analizar y visualizar movimientos bancarios de forma intuitiva y profesional, organizados en pestañas especializadas con un diseño profesional y optimizado.

![Dashboard Preview](https://img.shields.io/badge/Status-Activo-success)
![Version](https://img.shields.io/badge/Version-2.1.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## 📸 Capturas de Pantalla

### 🗂️ Vista General con Pestañas
*Interfaz principal del dashboard mostrando la organización por pestañas y el header profesional*

![Vista General](Screenshots/Captura1.png)

### 📊 Pestaña Resumen General
*Dashboard principal con KPIs, gráficos combinados y evolución del saldo*

![Resumen General](Screenshots/Captura2.png)

### 🔬 Pestaña Análisis de Gastos
*Análisis detallado con gráficos por categorías, sunburst y mapa de calor*

![Análisis de Gastos](Screenshots/Captura3.png)

## ✨ Características Principales

### 🎨 **Diseño Profesional**
- **Header Moderno**: Gradiente azul profesional con efectos glass morphism y backdrop blur
- **Footer Informativo**: Enlaces útiles, información de copyright y detalles del proyecto
- **Layout Responsive**: Diseño optimizado para todas las pantallas con altura completa
- **Iconografía Consistente**: Tabler Icons en toda la aplicación
- **Estética Moderna**: Uso de gradientes, sombras y efectos visuales profesionales

### ⚡ **Optimizaciones de Rendimiento**
- **Límites Inteligentes**: Los gráficos se limitan automáticamente a 36 meses (3 años) para mejor legibilidad cuando hay grandes volúmenes de datos
- **Feedback Visual**: Indicadores informativos cuando se aplican limitaciones de datos mostrando "X de Y meses totales"
- **Mapa de Calor Optimizado**: Limitado a 3 años para evitar problemas de rendimiento y sobrecarga visual
- **Carga Eficiente**: Procesamiento optimizado de grandes datasets con filtrado inteligente
- **Memoria Optimizada**: useMemo estratégico para evitar recálculos innecesarios

### 🗂️ **Organización por Pestañas**rd Financiero Personal

Una aplicación web moderna y completa para el análisis de finanzas personales construida con React, TypeScript y Mantine UI. Permite cargar, analizar y visualizar movimientos bancarios de forma intuitiva y profesional, organizados en pestañas especializadas.

![Dashboard Preview](https://img.shields.io/badge/Status-Activo-success)
![Version](https://img.shields.io/badge/Version-2.1.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## ✨ Características Principales

### �️ **Organización por Pestañas**
La aplicación está estructurada en tres pestañas principales que proporcionan diferentes perspectivas de análisis:

#### 📊 **Pestaña 1: Resumen General**
*Vista principal que responde a "¿Cómo voy?"*
- **Tarjetas KPI**: Saldo actual, Ingresos, Gastos y Ahorro del período
- **Gráfico Ingresos vs Gastos**: Barras mensuales con línea de ahorro superpuesta y leyenda horizontal optimizada en la parte superior
- **Evolución del Saldo**: Línea temporal del balance financiero por mes con optimización automática para grandes datasets

#### 🔬 **Pestaña 2: Análisis de Gastos**
*Dedicada a responder "¿En qué y cuándo gasto mi dinero?"*
- **Gastos por Categoría**: Gráfico de barras horizontales de principales gastos
- **Evolución Mensual por Categoría**: Análisis temporal con selector múltiple de categorías para comparativas
- **Desglose Jerárquico**: Gráfico Sunburst por categoría y subcategoría
- **Mapa de Calor Calendario**: Patrones de gasto diarios para identificar tendencias (optimizado para 3 años)

#### 🧾 **Pestaña 3: Todas las Transacciones**
*Herramienta completa de exploración de datos*
- **Tabla Completa**: Con todos los filtros, ordenación y funcionalidades
- **Espacio Optimizado**: Diseñada para visualización óptima en cualquier pantalla
- **Análisis Detallado**: Acceso granular a cada transacción

### 🎛️ **Filtros Globales**
Los filtros principales (rango de fechas, selector de cuentas, etc.) están ubicados **fuera** del componente de pestañas, aplicándose a todas las vistas simultáneamente para mantener una experiencia de análisis consistente.

### � **Visualizaciones Avanzadas**
- **Gráficos Combinados**: Barras e líneas superpuestas para análisis multi-dimensional
- **Leyendas Optimizadas**: Posicionamiento horizontal en la parte superior para mejor aprovechamiento del espacio
- **Interactividad**: Tooltips detallados con formato de moneda española
- **Responsividad**: Adaptación automática a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves con Nivo para mejor UX
- **Rendimiento Inteligente**: Limitación automática de datos para mantener legibilidad en gráficos con muchos puntos

### 🔍 **Sistema de Filtros Avanzado**
- **Búsqueda Global**: Debounced search por concepto, categoría y cuenta
- **Filtros de Categoría**: MultiSelect con búsqueda y selección múltiple
- **Rangos de Fecha**: DatePicker con presets rápidos (este mes, mes pasado, este año)
- **Ordenamiento**: Clickeable por importe (ascendente/descendente/sin orden)
- **Badges Activos**: Indicadores visuales de filtros aplicados con eliminación individual
- **Reset Completo**: Botón para limpiar todos los filtros de una vez

### 📋 **Tabla de Transacciones Profesional**
- **Paginación Inteligente**: 25, 50, 100, 200 registros por página
- **Claves Únicas**: Sistema robusto para evitar warnings de React
- **Formato de Moneda**: Visualización en euros con formato español
- **Responsive**: Adaptable a diferentes tamaños de pantalla
- **Performance**: Optimizada para manejar miles de transacciones

### 📊 **KPIs y Métricas**
- **Balance Total**: Saldo actual de todas las cuentas
- **Ingresos del Periodo**: Total de entradas en el rango seleccionado
- **Gastos del Periodo**: Total de salidas en el rango seleccionado
- **Ahorro Neto**: Diferencia entre ingresos y gastos
- **Indicadores Visuales**: Iconos y colores intuitivos para cada métrica

## 🛠️ Stack Tecnológico

### **Frontend**
- **React 19.1.1** - Framework moderno con las últimas características
- **TypeScript 5.8.3** - Tipado estático para mayor robustez
- **Vite 7.1.2** - Build tool ultrarrápido y servidor de desarrollo

### **UI/UX**
- **Mantine UI 8.2.4** - Librería de componentes moderna y completa
  - `@mantine/core` - Componentes base
  - `@mantine/dates` - Selectores de fecha avanzados
  - `@mantine/hooks` - Hooks útiles para React
- **Tabler Icons** - Iconografía profesional y consistente

### **Visualización de Datos**
- **Nivo 0.99.0** - Suite completa de gráficos interactivos
  - `@nivo/line` - Gráficos de línea
  - `@nivo/bar` - Gráficos de barras
  - `@nivo/pie` - Gráficos circulares y donut
  - `@nivo/calendar` - Mapas de calor de calendario
  - `@nivo/sunburst` - Gráficos jerárquicos Sunburst

### **Estado y Datos**
- **Zustand 5.0.7** - Gestión de estado ligera y eficiente
- **Papa Parse 5.5.3** - Procesamiento robusto de archivos CSV
- **date-fns 4.1.0** - Manipulación y formateo de fechas

## 🚀 Inicio Rápido

### **Prerrequisitos**
- Node.js 18+ 
- npm o yarn

### **Instalación**

1. **Clona el repositorio**:
```bash
git clone https://github.com/danizd/dashboard-movimientos-bancarios.git
cd dashboard-movimientos-bancarios
```

2. **Instala las dependencias**:
```bash
npm install
```

3. **Inicia el servidor de desarrollo**:
```bash
npm run dev
```

4. **Abre tu navegador en**: `http://localhost:5173`

### **Comandos Disponibles**

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo con hot reload

# Producción
npm run build        # Build optimizado para producción
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint para verificar código
```

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── TabbedDashboardView.tsx    # Componente principal con pestañas
│   │   ├── OverviewTab.tsx            # Pestaña 1: Resumen General
│   │   ├── ExpensesAnalysisTab.tsx    # Pestaña 2: Análisis de Gastos
│   │   ├── TransactionsTable.tsx      # Pestaña 3: Todas las Transacciones
│   │   ├── KpiCards.tsx               # Tarjetas de métricas (KPIs)
│   │   ├── Filters.tsx                # Controles de filtrado globales
│   │   ├── ChartsGrid.tsx             # Grid legacy (mantenido por compatibilidad)
│   │   └── DashboardView.tsx          # Vista legacy (mantenida por compatibilidad)
│   ├── FileUploader/
│   │   └── FileUploader.tsx           # Componente de carga de archivos
│   └── Layout/
│       └── Layout.tsx                 # Layout principal con header
├── store/
│   └── financialStore.ts              # Estado global con Zustand
├── types/
│   └── transaction.ts                 # Tipos TypeScript
├── utils/
│   └── csvParser.ts                   # Utilidades para procesar CSV
└── main.tsx                           # Punto de entrada de la aplicación
```

### **Arquitectura de Componentes**

#### **🗂️ TabbedDashboardView**
Componente principal que orquesta las pestañas y mantiene los filtros globales fuera de las pestañas para consistencia entre vistas.

#### **📊 OverviewTab**
- Incluye `KpiCards` para métricas principales
- Gráfico combinado de ingresos vs gastos con línea de ahorro
- Evolución mensual del saldo

#### **🔬 ExpensesAnalysisTab**
- Gastos por categoría (barras horizontales)
- Gráfico Sunburst jerárquico por categoría/subcategoría
- Mapa de calor de calendario para patrones de gasto

#### **🧾 TransactionsTable**
- Tabla completa con filtros avanzados
- Optimizada para visualización y exploración de datos
- Sistema de paginación y ordenamiento inteligente

## 📊 Formato de Datos CSV

El dashboard espera archivos CSV con las siguientes columnas:

| Columna | Descripción | Formato | Ejemplo |
|---------|-------------|---------|---------|
| `Fecha contable` | Fecha de la transacción | DD-MM-YYYY | 15-08-2025 |
| `Fecha valor` | Fecha valor de la operación | DD-MM-YYYY | 15-08-2025 |
| `Concepto` | Descripción de la transacción | Texto | Compra en supermercado |
| `Importe` | Cantidad de la transacción | Decimal (,) | -25,50 |
| `Moneda` | Divisa | Texto | EUR |
| `Saldo` | Saldo después de la operación | Decimal (,) | 1.234,56 |
| `Concepto ampliado` | Descripción extendida | Texto | Detalles adicionales |
| `Categoria` | Categoría de la transacción | Texto | Alimentación |
| `Subcategoria` | Subcategoría | Texto | Supermercado |
| `cuenta` | Cuenta bancaria | Texto | Cuenta Corriente |

### **Características del Parser CSV**
- ✅ **Delimitador**: Punto y coma (;)
- ✅ **Decimal**: Coma (,) 
- ✅ **Encoding**: UTF-8
- ✅ **Headers**: Primera fila como nombres de columna
- ✅ **Validación**: Filtrado automático de filas inválidas
- ✅ **Ordenamiento**: Por fecha (más reciente primero)
- ✅ **Formatos de Fecha**: Soporte para DD/MM/YYYY y DD-MM-YYYY
- ✅ **Robustez**: Manejo de errores y validación de datos

## 🎨 Características de UX/UI

### **🗂️ Navegación por Pestañas**
- **Persistencia de Filtros**: Los filtros globales se mantienen al cambiar entre pestañas
- **Iconografía Intuitiva**: Cada pestaña tiene íconos descriptivos y emojis para fácil identificación
- **Diseño de Pills**: Pestañas con estilo moderno y redondeado
- **Carga Lazy**: Los componentes de cada pestaña se cargan según necesidad

### **📊 Experiencia de Análisis**
- **Flujo Lógico**: Desde vista general → análisis específico → datos detallados
- **Consistencia Visual**: Paleta de colores y formatos unificados entre pestañas
- **Tooltips Contextuales**: Información detallada al hacer hover en gráficos
- **Responsive**: Cada pestaña optimizada para diferentes tamaños de pantalla

### **🎯 Casos de Uso por Pestaña**

#### **📊 Resumen General**
*"¿Cómo voy financieramente?"*
- Revisión rápida del estado actual
- Identificación de tendencias principales
- Comparativa ingresos vs gastos mensual

#### **🔬 Análisis de Gastos**
*"¿En qué y cuándo gasto mi dinero?"*
- Identificación de categorías problemáticas
- Análisis de patrones temporales de gasto
- Desglose jerárquico detallado

#### **🧾 Todas las Transacciones**
*"¿Qué operaciones específicas he realizado?"*
- Búsqueda y filtrado granular
- Auditoría de movimientos específicos
- Exportación y análisis detallado

### **Diseño Responsive**
- **Desktop First**: Optimizado para pantallas grandes
- **Centrado**: Layout con máximo 1280px para legibilidad óptima
- **Full Width**: Gráficos que aprovechan todo el ancho disponible
- **Mobile Friendly**: Adaptable a dispositivos móviles

### **Interactividad Avanzada**
- **Tooltips Informativos**: Hover sobre gráficos muestra detalles
- **Filtros en Tiempo Real**: Actualizaciones instantáneas
- **Feedback Visual**: Estados de carga, errores y éxito
- **Navegación Intuitiva**: Controles familiares y accesibles

### **Paleta de Colores**
- **Ingresos**: Verde (#40c057)
- **Gastos**: Rojo (#fa5252)
- **Información**: Azul (#228be6)
- **Advertencias**: Naranja (#fd7e14)
- **Neutro**: Gris (#868e96)

## 🔧 Configuración y Personalización

### **Personalizar Categorías**
Las categorías se extraen automáticamente del CSV, pero puedes personalizarlas editando el parser en `src/utils/csvParser.ts`.

### **Añadir Nuevos Gráficos**
Para agregar visualizaciones:
1. Instala componentes de Nivo si es necesario
2. Añade la lógica de datos en `ChartsGrid.tsx`
3. Implementa el componente del gráfico

### **Modificar KPIs**
Los indicadores se calculan en `KpiCards.tsx` basándose en el estado filtrado.

## 🚀 Despliegue

### **Vercel (Recomendado)**
```bash
npm run build
npx vercel --prod
```

### **Netlify**
```bash
npm run build
# Sube la carpeta dist/
```

### **GitHub Pages**
```bash
npm run build
# Configura GitHub Pages para servir desde dist/
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Roadmap

### **Próximas Características**
- [ ] **Exportación de Reportes**: PDF y Excel con datos de cada pestaña
- [ ] **Comparativas Personalizadas**: Selección de períodos específicos
- [ ] **Categorización Automática**: IA para clasificar transacciones nuevas
- [ ] **Presupuestos**: Gestión de presupuestos por categoría con alertas
- [ ] **Predicciones**: Proyecciones de gastos basadas en histórico
- [ ] **Múltiples Bancos**: Soporte para diferentes formatos CSV
- [ ] **Sincronización**: Conexión directa con APIs bancarias

### **Mejoras de UX/UI**
- [ ] **Personalización**: Configuración de vista por defecto en pestañas
- [ ] **Dashboards Personalizados**: Drag & drop de widgets
- [ ] **Temas**: Múltiples esquemas de color
- [ ] **Tutoriales**: Onboarding interactivo

### **Mejoras Técnicas**
- [ ] **Tests**: Suite de testing completa con Jest y Testing Library
- [ ] **PWA**: Aplicación web progresiva con offline support
- [ ] **Dark Mode**: Tema oscuro completo
- [ ] **i18n**: Soporte multiidioma (inglés, catalán)
- [ ] **Performance**: Lazy loading y virtualización para tablas grandes

## 📋 Changelog

### **v2.1.0** (Agosto 2025) - **Diseño Profesional y Optimizaciones**
- 🎨 **NUEVO**: Header profesional con gradiente y efectos glass morphism
- 🦶 **NUEVO**: Footer informativo con enlaces y copyright
- 📊 **MEJORADO**: Leyendas horizontales en gráficos combinados para mejor aprovechamiento del espacio
- ⚡ **NUEVO**: Optimizaciones de rendimiento para datasets grandes
  - Limitación automática a 36 meses en gráficos temporales
  - Limitación a 3 años en mapas de calor de calendario
  - Feedback visual cuando se aplican limitaciones
- 🔧 **MEJORADO**: Parser CSV con soporte para múltiples formatos de fecha (DD/MM/YYYY y DD-MM-YYYY)
- 🎯 **MEJORADO**: Layout responsive con altura completa y espaciado optimizado
- 💫 **MEJORADO**: Efectos visuales y estética profesional en toda la aplicación

### **v2.0.0** (Agosto 2025) - **Nueva Arquitectura de Pestañas**
- 🗂️ **NUEVA**: Arquitectura de pestañas especializadas
  - 📊 Pestaña "Resumen General" con KPIs y gráficos principales
  - 🔬 Pestaña "Análisis de Gastos" con Sunburst y mapa de calor
  - 🧾 Pestaña "Todas las Transacciones" dedicada exclusivamente a datos
- 🎯 **MEJORADO**: Filtros globales aplicados a todas las pestañas
- 📈 **NUEVO**: Gráfico Sunburst jerárquico para categorías/subcategorías
- 🔄 **MEJORADO**: Experiencia de usuario más intuitiva y organizada
- 💫 **NUEVO**: Animaciones y transiciones mejoradas entre pestañas

### **v1.0.0** (Agosto 2025) - **Lanzamiento Inicial**
- ✨ Dashboard completo con 7 tipos de gráficos
- 🔍 Sistema de filtros avanzado con búsqueda debounced
- 📊 Tabla de transacciones con ordenamiento y paginación
- 🎨 Interfaz responsive centrada en 1280px
- 🏷️ Badges de filtros activos con eliminación individual
- 📅 Presets de fecha (este mes, mes pasado, este año)
- 🔧 Parsing robusto de CSV con validación de datos
- ⚡ Performance optimizada con React 19 y Zustand

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Daniel** - [@danizd](https://github.com/danizd)

## 🙏 Agradecimientos

- [Mantine UI](https://mantine.dev/) - Por la excelente librería de componentes
- [Nivo](https://nivo.rocks/) - Por los gráficos interactivos
- [React](https://reactjs.org/) - Por el framework robusto
- [Vite](https://vitejs.dev/) - Por la herramienta de build ultrarrápida

---

⭐ **¡Si te gusta este proyecto, no olvides darle una estrella!** ⭐
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
