import { Stack, Tabs, Container } from '@mantine/core';
import { IconChartBar, IconSearch, IconFileText } from '@tabler/icons-react';
import Filters from './Filters';
import OverviewTab from './OverviewTab';
import ExpensesAnalysisTab from './ExpensesAnalysisTab';
import TransactionsTable from './TransactionsTable';

export default function TabbedDashboardView() {
  return (
    <Container size="xl" py="lg" px="md">
      <Stack gap="xl">
        {/* Filtros globales - fuera de las pestañas para que afecten a todas */}
        <Filters />
        
        {/* Pestañas del dashboard */}
        <Tabs defaultValue="overview" variant="pills" radius="md">
          <Tabs.List grow>
            <Tabs.Tab
              value="overview"
              leftSection={<IconChartBar size={18} />}
            >
              📊 Resumen General
            </Tabs.Tab>
            <Tabs.Tab
              value="expenses"
              leftSection={<IconSearch size={18} />}
            >
              🔬 Análisis de Gastos
            </Tabs.Tab>
            <Tabs.Tab
              value="transactions"
              leftSection={<IconFileText size={18} />}
            >
              🧾 Todas las Transacciones
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="overview" pt="lg">
            <OverviewTab />
          </Tabs.Panel>

          <Tabs.Panel value="expenses" pt="lg">
            <ExpensesAnalysisTab />
          </Tabs.Panel>

          <Tabs.Panel value="transactions" pt="lg">
            <TransactionsTable />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Container>
  );
}
