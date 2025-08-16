# Dashboard Financiero Personal

Una aplicación web moderna para el análisis de finanzas personales construida con React, TypeScript y Mantine UI.

## 🚀 Características

- **Carga de datos CSV**: Arrastra y suelta o selecciona archivos CSV con tus movimientos bancarios
- **Análisis en tiempo real**: KPIs financieros calculados automáticamente
- **Visualizaciones interactivas**: Gráficos de evolución del saldo, gastos por categoría y distribución
- **Filtros avanzados**: Por fecha, cuenta y tipo de transacción
- **Tabla virtualizada**: Navegación eficiente de miles de transacciones
- **Diseño responsive**: Optimizado para escritorio y móvil

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de interfaz de usuario
- **TypeScript** - Tipado estático
- **Vite** - Herramienta de build y desarrollo
- **Mantine UI** - Librería de componentes
- **Nivo** - Gráficos interactivos
- **Zustand** - Gestión de estado
- **Papa Parse** - Procesamiento de archivos CSV
- **date-fns** - Manipulación de fechas
- **Mantine React Table** - Tabla virtualizada

## 🚀 Inicio Rápido

1. Instala las dependencias:
```bash
npm install
```

2. Inicia el servidor de desarrollo:
```bash
npm run dev
```

3. Abre tu navegador en `http://localhost:5173`

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
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
