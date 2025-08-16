import { SimpleGrid, Card, Title, Box, Stack, Group, Text, MultiSelect, useMantineTheme } from '@mantine/core';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { useFinancialStore } from '../../store/financialStore';
import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, getYear } from 'date-fns';

export default function ChartsGrid() {
  const { filteredTransactions, transactions } = useFinancialStore();
  const theme = useMantineTheme();
  
  // Estado para el nuevo gráfico de gastos por categoría por año
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Paleta de colores con fallbacks seguros
  const chartColors = [
    theme?.colors?.blue?.[6] || '#228be6',
    theme?.colors?.green?.[6] || '#40c057',
    theme?.colors?.red?.[6] || '#fa5252',
    theme?.colors?.yellow?.[6] || '#fab005',
    theme?.colors?.purple?.[6] || '#9775fa',
    theme?.colors?.cyan?.[6] || '#15aabf',
    theme?.colors?.orange?.[6] || '#fd7e14',
    theme?.colors?.pink?.[6] || '#e64980',
    theme?.colors?.gray?.[6] || '#868e96'
  ];

  // Función para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 1. Datos para evolución del saldo (agregados por mes)
  const balanceEvolutionData = useMemo(() => {
    if (filteredTransactions.length === 0) return [];

    const sortedTransactions = [...filteredTransactions].sort((a, b) => 
      a.fechaContable.getTime() - b.fechaContable.getTime()
    );

    const firstDate = sortedTransactions[0].fechaContable;
    const lastDate = sortedTransactions[sortedTransactions.length - 1].fechaContable;
    
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });
    
    const monthlyData = months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = sortedTransactions.filter(t => 
        t.fechaContable >= monthStart && t.fechaContable <= monthEnd
      );
      
      const lastTransaction = monthTransactions[monthTransactions.length - 1];
      const balance = lastTransaction ? lastTransaction.saldo : 0;
      
      return {
        x: format(month, 'MMM yyyy'),
        y: balance,
      };
    });

    return [{
      id: 'saldo',
      color: theme?.colors?.blue?.[6] || '#228be6',
      data: monthlyData,
    }];
  }, [filteredTransactions, theme?.colors?.blue]);

  // 2. Datos para gastos por categoría (horizontal)
  const expensesByCategoryData = useMemo(() => {
    const categoryTotals = filteredTransactions
      .filter(t => t.importe < 0)
      .reduce((acc, t) => {
        const category = t.categoria || 'Sin categoría';
        acc[category] = (acc[category] || 0) + Math.abs(t.importe);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);
  }, [filteredTransactions]);

  // 3. Datos para distribución de gastos (Donut Chart)
  const expensesDonutData = useMemo(() => {
    const categoryTotals = filteredTransactions
      .filter(t => t.importe < 0)
      .reduce((acc, t) => {
        const category = t.categoria || 'Sin categoría';
        acc[category] = (acc[category] || 0) + Math.abs(t.importe);
        return acc;
      }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, value) => sum + value, 0);

    return Object.entries(categoryTotals)
      .map(([id, value]) => ({
        id,
        label: id,
        value,
        percentage: ((value / total) * 100).toFixed(1),
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredTransactions]);

  // Calcular el total de gastos para mostrar en el centro del donut
  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(t => t.importe < 0)
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);
  }, [filteredTransactions]);

  // 4. Datos para gastos por categoría por año (NUEVO GRÁFICO)
  const { availableCategories, expensesByYearData } = useMemo(() => {
    const yearlyExpenses = transactions
      .filter(t => t.importe < 0)
      .reduce((acc, t) => {
        const year = getYear(t.fechaContable);
        const category = t.categoria || 'Sin categoría';
        
        if (!acc[year]) acc[year] = {};
        acc[year][category] = (acc[year][category] || 0) + Math.abs(t.importe);
        return acc;
      }, {} as Record<number, Record<string, number>>);

    // Obtener todas las categorías disponibles
    const allCategories = new Set<string>();
    Object.values(yearlyExpenses).forEach(yearData => {
      Object.keys(yearData).forEach(cat => allCategories.add(cat));
    });

    const categoriesList = Array.from(allCategories)
      .map(category => ({
        category,
        total: Object.values(yearlyExpenses).reduce((sum, yearData) => 
          sum + (yearData[category] || 0), 0)
      }))
      .sort((a, b) => b.total - a.total);

    // Si no hay categorías seleccionadas, usar las top 6
    const categoriesToShow = selectedCategories.length > 0 
      ? selectedCategories 
      : categoriesList.slice(0, 6).map(item => item.category);

    const data = Object.entries(yearlyExpenses)
      .map(([year, expenses]) => {
        const result: any = { año: year };
        categoriesToShow.forEach(category => {
          result[category] = expenses[category] || 0;
        });
        return result;
      })
      .sort((a, b) => parseInt(a.año) - parseInt(b.año));

    return {
      availableCategories: categoriesList.map(item => ({ value: item.category, label: item.category })),
      expensesByYearData: data
    };
  }, [transactions, selectedCategories]);

  return (
    <Stack gap="lg">
      {/* Fila 1: Evolución del saldo - ancho completo */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Evolución del Saldo por Mes</Title>
        <Box h={400}>
          <ResponsiveLine
            data={balanceEvolutionData}
            margin={{ top: 20, right: 30, bottom: 60, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              format: (value) => formatCurrency(value),
            }}
            colors={[theme?.colors?.blue?.[6] || '#228be6']}
            pointSize={0}
            enablePoints={false}
            enableArea={true}
            areaOpacity={0.2}
            enableGridX={false}
            enableGridY={true}
            enableCrosshair={true}
            useMesh={true}
            animate={true}
            motionConfig="gentle"
            tooltip={({ point }) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${theme?.colors?.blue?.[6] || '#228be6'}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{point.data.xFormatted}</strong>
                <br />
                <span style={{ color: theme?.colors?.blue?.[6] || '#228be6' }}>
                  Saldo: {formatCurrency(point.data.y as number)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>

      {/* Fila 2: Dos gráficos lado a lado */}
      <SimpleGrid cols={2} spacing="lg">
        {/* Gráfico de barras horizontales - Gastos por categoría */}
        <Card withBorder padding="lg" radius="md">
          <Title order={4} mb="md">Top 10 Gastos por Categoría</Title>
          <Box h={400}>
            <ResponsiveBar
              data={expensesByCategoryData}
              keys={['total']}
              indexBy="categoria"
              layout="horizontal"
              margin={{ top: 20, right: 30, bottom: 20, left: 120 }}
              padding={0.3}
              colors={[theme?.colors?.red?.[6] || '#fa5252']}
              borderRadius={4}
              borderWidth={1}
              borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                format: (value) => formatCurrency(value),
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
              }}
              enableLabel={true}
              labelTextColor={{ from: 'color', modifiers: [['darker', 1.8]] }}
              animate={true}
              motionConfig="gentle"
              tooltip={({ data, value, color }) => (
                <div
                  style={{
                    background: 'white',
                    padding: '12px 16px',
                    border: `2px solid ${color}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <strong>{data.categoria}</strong>
                  <br />
                  <span style={{ color }}>
                    Total: {formatCurrency(value)}
                  </span>
                </div>
              )}
            />
          </Box>
        </Card>

        {/* Donut Chart - Distribución de gastos */}
        <Card withBorder padding="lg" radius="md">
          <Title order={4} mb="md">Distribución de Gastos por Categoría</Title>
          <Box h={400} style={{ position: 'relative' }}>
            <ResponsivePie
              data={expensesDonutData}
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              innerRadius={0.6}
              padAngle={2}
              cornerRadius={4}
              activeOuterRadiusOffset={8}
              colors={{ scheme: 'category10' }}
              borderWidth={2}
              borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
              arcLinkLabelsSkipAngle={15}
              arcLinkLabelsTextColor="#333333"
              arcLinkLabelsThickness={2}
              arcLinkLabelsColor={{ from: 'color' }}
              arcLabelsSkipAngle={20}
              arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
              animate={true}
              motionConfig="gentle"
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: 'white',
                    padding: '12px 16px',
                    border: `2px solid ${datum.color}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  <strong>{datum.label}</strong>
                  <br />
                  <span style={{ color: datum.color }}>
                    {formatCurrency(datum.value)} ({datum.data.percentage}%)
                  </span>
                </div>
              )}
            />
            {/* Métrica central del donut */}
            <Box
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Text size="xs" c="dimmed" fw={500}>
                Total Gastos
              </Text>
              <Text size="lg" fw={700} c={theme?.colors?.red?.[6] || '#fa5252'}>
                {formatCurrency(totalExpenses)}
              </Text>
            </Box>
          </Box>
        </Card>
      </SimpleGrid>

      {/* Fila 3: Nuevo gráfico de gastos por categoría por año - ancho completo */}
      <Card withBorder padding="lg" radius="md">
        <Group justify="space-between" mb="md">
          <Title order={4}>Gastos por Categoría por Año</Title>
          <MultiSelect
            data={availableCategories}
            value={selectedCategories}
            onChange={setSelectedCategories}
            placeholder="Seleccionar categorías (por defecto: top 6)"
            searchable
            clearable
            style={{ minWidth: 300 }}
          />
        </Group>
        <Box h={450}>
          <ResponsiveBar
            data={expensesByYearData}
            keys={expensesByYearData.length > 0 ? Object.keys(expensesByYearData[0]).filter(k => k !== 'año') : []}
            indexBy="año"
            margin={{ top: 50, right: 130, bottom: 60, left: 80 }}
            padding={0.3}
            groupMode="grouped"
            colors={chartColors}
            borderRadius={4}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              format: (value) => formatCurrency(value),
            }}
            enableLabel={false}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            animate={true}
            motionConfig="gentle"
            tooltip={({ id, value, color, data }) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{data.año} - {id}</strong>
                <br />
                <span style={{ color }}>
                  Gasto: {formatCurrency(value)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>
    </Stack>
  );
}
