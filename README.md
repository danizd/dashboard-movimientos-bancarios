# 📊 Dashboard Financiero Personal

Una aplicación web moderna y completa para el análisis de finanzas personales construida con React, TypeScript y Mantine UI. Permite cargar, analizar y visualizar movimientos bancarios de forma intuitiva y profesional.

![Dashboard Preview](https://img.shields.io/badge/Status-Activo-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.1.1-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## ✨ Características Principales

### 📈 **Visualizaciones Avanzadas**
- **Evolución del Saldo**: Línea temporal del balance financiero
- **Ingresos vs Gastos**: Gráfico combinado con línea de ahorro neto
- **Top 10 Gastos por Categoría**: Barras horizontales de principales gastos
- **Distribución de Gastos**: Gráfico donut con porcentajes por categoría
- **Mapa de Calor Calendario**: Visualización de días con mayor gasto
- **Comparativa Anual**: Gráfico multilínea de gastos por año
- **Gastos por Categoría por Año**: Análisis temporal con selección de categorías

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
- **Categorización Automática**: Análisis inteligente de transacciones

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
│   │   ├── ChartsGrid.tsx         # Grid con todos los gráficos
│   │   ├── TransactionsTable.tsx  # Tabla avanzada de transacciones
│   │   ├── KpiCards.tsx          # Tarjetas de métricas
│   │   ├── Filters.tsx           # Controles de filtrado
│   │   └── FileUploader.tsx      # Componente de carga de archivos
│   └── Layout/
│       └── Layout.tsx            # Layout principal centrado
├── store/
│   └── financialStore.ts         # Estado global con Zustand
├── types/
│   └── transaction.ts            # Tipos TypeScript
├── utils/
│   └── csvParser.ts              # Utilidades para procesar CSV
└── main.tsx                      # Punto de entrada de la aplicación
```

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

## 🎨 Características de UX/UI

### **Diseño Responsive**
- **Desktop First**: Optimizado para pantallas grandes
- **Centrado**: Layout de 1280px centrado en la página
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
- [ ] **Exportación de Reportes**: PDF y Excel
- [ ] **Comparativas Anuales**: Más opciones de análisis temporal
- [ ] **Categorización Automática**: IA para clasificar transacciones
- [ ] **Presupuestos**: Gestión de presupuestos por categoría
- [ ] **Alertas**: Notificaciones de gastos inusuales
- [ ] **Múltiples Bancos**: Soporte para diferentes formatos CSV

### **Mejoras Técnicas**
- [ ] **Tests**: Suite de testing completa
- [ ] **PWA**: Aplicación web progresiva
- [ ] **Dark Mode**: Tema oscuro
- [ ] **i18n**: Soporte multiidioma

## 📋 Changelog

### **v1.0.0** (Agosto 2025)
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
