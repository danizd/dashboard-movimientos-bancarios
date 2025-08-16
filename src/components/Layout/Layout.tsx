import { Container, Group, Title, ActionIcon, Text, Box, Badge, Divider, Anchor, Stack } from '@mantine/core';
import { IconChartLine, IconRefresh, IconBrandGithub, IconCalendar } from '@tabler/icons-react';
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
    <Box style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Enhanced Header */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)',
          color: 'white',
          padding: 'var(--mantine-spacing-lg)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container size="xl">
          <Group style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Group>
              <Box
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '12px',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <IconChartLine size={32} color="white" />
              </Box>
              <Stack gap={4}>
                <Title order={2} c="white" style={{ fontWeight: 700, letterSpacing: '-0.025em' }}>
                  Dashboard Financiero
                </Title>
                <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                  Análisis inteligente de finanzas personales
                </Text>
              </Stack>
            </Group>
            
            {hasData && (
              <Group>
                <Badge
                  size="lg"
                  variant="light"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {transactions.length.toLocaleString()} transacciones
                </Badge>
                <ActionIcon
                  variant="light"
                  size="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                  onClick={handleReset}
                  title="Cargar nuevo archivo"
                >
                  <IconRefresh size={20} />
                </ActionIcon>
              </Group>
            )}
          </Group>
        </Container>
      </Box>

      {/* Main Content */}
      <Box style={{ flex: 1 }}>
        {children}
      </Box>

      {/* Professional Footer */}
      <Box
        style={{
          background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
          color: 'white',
          padding: 'var(--mantine-spacing-xl) 0',
          marginTop: 'var(--mantine-spacing-xl)',
          borderTop: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <Container size="xl">
          <Stack gap="md">
            <Group style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Stack gap="xs">
                <Group>
                  <IconChartLine size={24} color="white" />
                  <Title order={4} c="white">
                    Dashboard Financiero
                  </Title>
                </Group>
                <Text size="sm" style={{ color: 'rgba(255, 255, 255, 0.7)', maxWidth: '400px' }}>
                  Herramienta avanzada para el análisis y visualización de datos financieros personales. 
                  Convierte tus transacciones bancarias en insights accionables.
                </Text>
              </Stack>

              <Stack gap="xs" style={{ alignItems: 'flex-end' }}>
                <Group gap="xs">
                  <Anchor
                    href="https://github.com/danizd/dashboard-movimientos-bancarios"
                    target="_blank"
                    style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <Group gap={4}>
                      <IconBrandGithub size={16} />
                      <Text size="xs">GitHub</Text>
                    </Group>
                  </Anchor>
                  <Divider orientation="vertical" color="rgba(255, 255, 255, 0.3)" />
                  <Group gap={4}>
                    <IconCalendar size={16} color="rgba(255, 255, 255, 0.8)" />
                    <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      © 2025
                    </Text>
                  </Group>
                </Group>
              </Stack>
            </Group>

            <Divider color="rgba(255, 255, 255, 0.2)" />
            
            <Group style={{ justifyContent: 'center' }}>
              <Text size="xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                Dashboard Financiero v1.0 | Datos procesados localmente para tu privacidad
              </Text>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
