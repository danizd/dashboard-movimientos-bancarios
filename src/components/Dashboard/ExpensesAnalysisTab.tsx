import { Stack, Card, Title, Box, useMantineTheme, MultiSelect, Text } from '@mantine/core';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveSunburst } from '@nivo/sunburst';
import { ResponsiveLine } from '@nivo/line';
import { useFinancialStore } from '../../store/financialStore';
import { useMemo, useState } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export default function ExpensesAnalysisTab() {
  const { filteredTransactions } = useFinancialStore();
  const theme = useMantineTheme();
  
  // Estado para el selector de categorías en el gráfico temporal
  const [selectedCategoriesForTrend, setSelectedCategoriesForTrend] = useState<string[]>([]);

  // Función para formatear moneda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Datos para gastos por categoría (solo gastos negativos)
  const expensesByCategoryData = useMemo(() => {
    const categoryTotals = filteredTransactions
      .filter(transaction => transaction.importe < 0)
      .reduce((acc, transaction) => {
        const category = transaction.categoria || 'Sin categoría';
        acc[category] = (acc[category] || 0) + Math.abs(transaction.importe);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(categoryTotals)
      .map(([category, total]) => ({
        categoria: category,
        valor: Math.round(total)
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 15);
  }, [filteredTransactions]);

  // Datos para gráfico de barras agrupadas (categoría y subcategoría)
  const groupedBarData = useMemo(() => {
    // Agrupar por categoría y subcategoría
    const categoryData = filteredTransactions
      .filter(transaction => transaction.importe < 0)
      .reduce((acc, transaction) => {
        const category = transaction.categoria || 'Sin categoría';
        const subcategory = transaction.subcategoria || 'General';
        if (!acc[category]) acc[category] = {};
        acc[category][subcategory] = (acc[category][subcategory] || 0) + Math.abs(transaction.importe);
        return acc;
      }, {} as Record<string, Record<string, number>>);

    // Obtener todas las subcategorías únicas
    const subcategoriesSet = new Set<string>();
    Object.values(categoryData).forEach(subs => {
      Object.keys(subs).forEach(sub => subcategoriesSet.add(sub));
    });
    const subcategories = Array.from(subcategoriesSet);

    // Formato para Nivo Bar agrupado
    const data = Object.entries(categoryData)
      .map(([category, subs]) => {
        const entry: Record<string, any> = { categoria: category };
        subcategories.forEach(sub => {
          entry[sub] = Math.round(subs[sub] || 0);
        });
        return entry;
      })
      .sort((a, b) => {
        // Ordenar por gasto total descendente
        const totalA = subcategories.reduce((sum, sub) => sum + (a[sub] || 0), 0);
        const totalB = subcategories.reduce((sum, sub) => sum + (b[sub] || 0), 0);
        return totalB - totalA;
      })
      .slice(0, 8); // Top 8 categorías

    return { data, subcategories };
  }, [filteredTransactions]);

  // Calcular rango de fechas para el calendario

  // Datos para el mapa de calor del calendario

  // Datos para el gráfico de gastos por categoría por mes (líneas múltiples)
  const { availableCategoriesForTrend, expensesTrendData } = useMemo(() => {
    if (filteredTransactions.length === 0) {
      return { availableCategoriesForTrend: [], expensesTrendData: [] };
    }

    // Obtener transacciones de gastos ordenadas por fecha
    const expenseTransactions = filteredTransactions
      .filter(t => t.importe < 0)
      .sort((a, b) => a.fechaContable.getTime() - b.fechaContable.getTime());

    if (expenseTransactions.length === 0) {
      return { availableCategoriesForTrend: [], expensesTrendData: [] };
    }

    // Calcular rango de meses
    const firstDate = expenseTransactions[0].fechaContable;
    const lastDate = expenseTransactions[expenseTransactions.length - 1].fechaContable;
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });

    // Si hay más de 36 meses (3 años), usar solo los últimos 36 para mejor visualización
    const monthsToShow = months.length > 36 ? months.slice(-36) : months;

    // Obtener todas las categorías y calcular totales para ordenar
    const categoryTotals = expenseTransactions.reduce((acc, t) => {
      const category = t.categoria || 'Sin categoría';
      acc[category] = (acc[category] || 0) + Math.abs(t.importe);
      return acc;
    }, {} as Record<string, number>);

    const categoriesList = Object.entries(categoryTotals)
      .map(([category, total]) => ({ value: category, label: category, total }))
      .sort((a, b) => b.total - a.total);

    // Si no hay categorías seleccionadas, usar las top 5
    const categoriesToShow = selectedCategoriesForTrend.length > 0 
      ? selectedCategoriesForTrend 
      : categoriesList.slice(0, 5).map(item => item.value);

    // Calcular datos mensuales por categoría (solo para los meses a mostrar)
    const monthlyDataByCategory = monthsToShow.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = expenseTransactions.filter(t => 
        t.fechaContable >= monthStart && t.fechaContable <= monthEnd
      );
      
      const monthLabel = format(month, 'MMM yyyy');
      const categoryExpenses = monthTransactions.reduce((acc, t) => {
        const category = t.categoria || 'Sin categoría';
        acc[category] = (acc[category] || 0) + Math.abs(t.importe);
        return acc;
      }, {} as Record<string, number>);
      
      return {
        month: monthLabel,
        ...categoryExpenses
      };
    });

    // Convertir a formato de líneas para Nivo
    const lineData = categoriesToShow.map(category => ({
      id: category,
      color: theme?.colors?.[['blue', 'red', 'green', 'orange', 'purple', 'cyan', 'yellow', 'pink'][
        categoriesToShow.indexOf(category) % 8
      ]]?.[6] || '#000000',
      data: monthlyDataByCategory.map(monthData => ({
        x: monthData.month,
        y: Math.round((monthData as any)[category] || 0)
      }))
    }));

    return {
      availableCategoriesForTrend: categoriesList,
      expensesTrendData: lineData
    };
  }, [filteredTransactions, selectedCategoriesForTrend, theme?.colors]);

  return (
    <Stack gap="lg">
      {/* Gastos por categoría */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Gastos por Categoría</Title>
        <Box h={400}>
          <ResponsiveBar
            data={expensesByCategoryData}
            keys={['valor']}
            indexBy="categoria"
            margin={{ top: 20, right: 50, bottom: 100, left: 80 }}
            padding={0.3}
            layout="horizontal"
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
              tickRotation: 0,
            }}
            enableLabel={true}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            animate={true}
            motionConfig="gentle"
            tooltip={({ value, color, indexValue }) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{indexValue}</strong>
                <br />
                <span style={{ color }}>
                  {formatCurrency(value as number)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>

      {/* Tabla de gastos más importantes (>600€) */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Gastos más importantes (&gt;600€)</Title>
        <Box h={300} style={{ overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: theme.colors.gray[1] }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Concepto</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Categoría</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Subcategoría</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Importe</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Cuenta</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions
                .filter(t => t.importe < -600)
                .sort((a, b) => Math.abs(b.importe) - Math.abs(a.importe))
                .map((t, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : theme.colors.gray[0] }}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{format(t.fechaContable, 'dd-MM-yyyy')}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.concepto}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.categoria || 'Sin categoría'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.subcategoria || 'General'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: theme.colors.red[6], fontWeight: 'bold' }}>{formatCurrency(Math.abs(t.importe))}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.cuenta}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </Card>
  {/* ...existing code... */}

      {/* Gráfico de gastos por categoría por mes */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Evolución de Gastos por Categoría (Mensual)</Title>
        
        {/* Selector de categorías */}
        <MultiSelect
          label="Seleccionar categorías (máximo recomendado: 5)"
          placeholder="Selecciona categorías para mostrar"
          data={availableCategoriesForTrend}
          value={selectedCategoriesForTrend}
          onChange={setSelectedCategoriesForTrend}
          maxValues={8}
          clearable
          searchable
          mb="md"
        />
        
        {filteredTransactions.length > 0 && (
          <Box mb="sm">
            <Text size="sm" c="dimmed">
              {(() => {
                const expenseTransactions = filteredTransactions.filter(t => t.importe < 0);
                if (expenseTransactions.length === 0) return 'No hay gastos en el período seleccionado';
                
                const sortedTransactions = expenseTransactions.sort((a, b) => a.fechaContable.getTime() - b.fechaContable.getTime());
                const firstDate = sortedTransactions[0].fechaContable;
                const lastDate = sortedTransactions[sortedTransactions.length - 1].fechaContable;
                const months = eachMonthOfInterval({ start: firstDate, end: lastDate });
                
                if (months.length > 36) {
                  return `Mostrando los últimos 36 meses de ${months.length} meses disponibles (${format(months.slice(-36)[0], 'MMM yyyy')} - ${format(months[months.length - 1], 'MMM yyyy')})`;
                } else {
                  return `Mostrando ${months.length} meses (${format(firstDate, 'MMM yyyy')} - ${format(lastDate, 'MMM yyyy')})`;
                }
              })()}
            </Text>
          </Box>
        )}
        
        <Box h={400}>
          <ResponsiveLine
            data={expensesTrendData}
            margin={{ top: 20, right: 110, bottom: 80, left: 80 }}
            xScale={{ type: 'point' }}
            yScale={{ type: 'linear', min: 0, max: 'auto' }}
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
            colors={{ datum: 'color' }}
            pointSize={6}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            enablePoints={true}
            enableArea={false}
            lineWidth={3}
            enableGridX={false}
            enableGridY={true}
            enableCrosshair={true}
            useMesh={true}
            animate={true}
            motionConfig="gentle"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(0, 0, 0, .5)',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            tooltip={({ point }) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${point.color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{point.data.xFormatted}</strong>
                <br />
                <strong>{point.seriesId}</strong>
                <br />
                <span style={{ color: point.color }}>
                  {formatCurrency(point.data.y as number)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>

      {/* Tabla de gastos más importantes (>600€) */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Gastos más importantes (&gt;600€)</Title>
        <Box h={300} style={{ overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: theme.colors.gray[1] }}>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Fecha</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Concepto</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Categoría</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Subcategoría</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Importe</th>
                <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Cuenta</th>
              </tr>
            </thead>
            <tbody>
                {filteredTransactions
                .filter(t => t.importe < -600)
                .sort((a, b) => Math.abs(b.importe) - Math.abs(a.importe))
                .map((t, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : theme.colors.gray[0] }}>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{format(t.fechaContable, 'dd-MM-yyyy')}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.concepto}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.categoria || 'Sin categoría'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.subcategoria || 'General'}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: theme.colors.red[6], fontWeight: 'bold' }}>{formatCurrency(Math.abs(t.importe))}</td>
                  <td style={{ padding: '8px', borderBottom: '1px solid #eee' }}>{t.cuenta}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Box>
      </Card>
    </Stack>
  );
}
