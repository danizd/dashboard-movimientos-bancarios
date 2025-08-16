import { Stack } from '@mantine/core';
import Filters from './Filters';
import KpiCards from './KpiCards';
import ChartsGrid from './ChartsGrid';
import TransactionsTable from './TransactionsTable';

export default function DashboardView() {
  return (
    <Stack style={{ gap: 'var(--mantine-spacing-xl)' }}>
      {/* Barra de filtros */}
      <Filters />
      
      {/* Tarjetas de KPIs */}
      <KpiCards />
      
      {/* Grid de gráficos */}
      <ChartsGrid />
      
      {/* Tabla de transacciones */}
      <TransactionsTable />
    </Stack>
  );
}
