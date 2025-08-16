import { SimpleGrid, Card, Text, Group, ThemeIcon } from '@mantine/core';
import { IconWallet, IconTrendingUp, IconTrendingDown, IconPigMoney } from '@tabler/icons-react';
import { useFinancialStore } from '../../store/financialStore';
import { useMemo } from 'react';

export default function KpiCards() {
  const { filteredTransactions } = useFinancialStore();

  const kpis = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.importe > 0)
      .reduce((sum, t) => sum + t.importe, 0);
      
    const expenses = filteredTransactions
      .filter(t => t.importe < 0)
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);
      
    const finalBalance = filteredTransactions.length > 0 
      ? filteredTransactions[0].saldo 
      : 0;
      
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

    return {
      finalBalance,
      totalIncome: income,
      totalExpenses: expenses,
      savingsRate,
    };
  }, [filteredTransactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  const formatPercentage = (percentage: number) => {
    return `${percentage.toFixed(1)}%`;
  };

  const kpiData = [
    {
      title: 'Saldo Final',
      value: formatCurrency(kpis.finalBalance),
      icon: IconWallet,
      color: 'blue',
    },
    {
      title: 'Ingresos Totales',
      value: formatCurrency(kpis.totalIncome),
      icon: IconTrendingUp,
      color: 'green',
    },
    {
      title: 'Gastos Totales',
      value: formatCurrency(kpis.totalExpenses),
      icon: IconTrendingDown,
      color: 'red',
    },
    {
      title: 'Tasa de Ahorro',
      value: formatPercentage(kpis.savingsRate),
      icon: IconPigMoney,
      color: kpis.savingsRate > 20 ? 'green' : kpis.savingsRate > 10 ? 'yellow' : 'red',
    },
  ];

  return (
    <SimpleGrid cols={4} spacing="lg">
      {kpiData.map((kpi) => (
        <Card key={kpi.title} withBorder padding="lg" radius="md">
          <Group style={{ justifyContent: 'space-between' }}>
            <div>
              <Text size="xs" c="dimmed" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                {kpi.title}
              </Text>
              <Text size="xl" fw={700} mt="xs">
                {kpi.value}
              </Text>
            </div>
            <ThemeIcon color={kpi.color} variant="light" size="xl" radius="md">
              <kpi.icon style={{ width: '60%', height: '60%' }} stroke={1.5} />
            </ThemeIcon>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
