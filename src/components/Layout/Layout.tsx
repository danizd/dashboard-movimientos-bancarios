import { Container, Group, Title, ActionIcon, Text, Box } from '@mantine/core';
import { IconChartLine, IconRefresh } from '@tabler/icons-react';
import { useFinancialStore } from '../../store/financialStore';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { transactions, clearData } = useFinancialStore();
  const hasData = transactions.length > 0;

  const handleReset = () => {
    clearData();
  };

  return (
    <Box>
      {/* Header */}
      <Box
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
          backgroundColor: 'var(--mantine-color-gray-0)',
          padding: 'var(--mantine-spacing-md)',
          marginBottom: 'var(--mantine-spacing-md)',
        }}
      >
        <Container size="xl">
          <Group style={{ justifyContent: 'space-between', width: '100%' }}>
            <Group>
              <IconChartLine size={28} color="var(--mantine-color-blue-6)" />
              <div>
                <Title order={3} c="blue">
                  Dashboard Financiero
                </Title>
                <Text size="xs" c="dimmed">
                  Análisis de finanzas personales
                </Text>
              </div>
            </Group>
            
            {hasData && (
              <Group>
                <Text size="sm" c="dimmed">
                  {transactions.length} transacciones cargadas
                </Text>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={handleReset}
                  title="Cargar nuevo archivo"
                >
                  <IconRefresh size={18} />
                </ActionIcon>
              </Group>
            )}
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Container style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        {children}
      </Container>
    </Box>
  );
}
