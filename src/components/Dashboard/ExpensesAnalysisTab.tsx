import { Stack, Card, Title, Box, useMantineTheme, MultiSelect, Text } from '@mantine/core';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveCalendar } from '@nivo/calendar';
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

  // Datos para el Sunburst (categoría principal y subcategorías)
  const sunburstData = useMemo(() => {
    const categoryData = filteredTransactions
      .filter(transaction => transaction.importe < 0)
      .reduce((acc, transaction) => {
        const category = transaction.categoria || 'Sin categoría';
        const subcategory = transaction.subcategoria || 'General';
        
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            subcategories: {}
          };
        }
        
        acc[category].total += Math.abs(transaction.importe);
        acc[category].subcategories[subcategory] = 
          (acc[category].subcategories[subcategory] || 0) + Math.abs(transaction.importe);
        
        return acc;
      }, {} as Record<string, { total: number; subcategories: Record<string, number> }>);

    const sunburstChildren = Object.entries(categoryData)
      .map(([category, data]) => ({
        name: category,
        value: Math.round(data.total),
        children: Object.entries(data.subcategories)
          .map(([subcategory, value]) => ({
            name: subcategory,
            value: Math.round(value)
          }))
          .sort((a, b) => b.value - a.value)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    return {
      name: 'gastos',
      children: sunburstChildren
    };
  }, [filteredTransactions]);

  // Calcular rango de fechas para el calendario
  const { minDate, maxDate, isLimitedRange } = useMemo(() => {
    if (filteredTransactions.length === 0) {
      const currentYear = new Date().getFullYear();
      return {
        minDate: `${currentYear}-01-01`,
        maxDate: `${currentYear}-12-31`,
        isLimitedRange: false
      };
    }

    const expenseTransactions = filteredTransactions.filter(t => t.importe < 0);
    if (expenseTransactions.length === 0) {
      const currentYear = new Date().getFullYear();
      return {
        minDate: `${currentYear}-01-01`,
        maxDate: `${currentYear}-12-31`,
        isLimitedRange: false
      };
    }

    const dates = expenseTransactions.map(t => t.fechaContable);
    const min = new Date(Math.min(...dates.map(d => d.getTime())));
    const max = new Date(Math.max(...dates.map(d => d.getTime())));
    
    // Si el rango es mayor a 3 años, limitar a los últimos 3 años
    const rangeInYears = max.getFullYear() - min.getFullYear();
    let finalMin = min;
    let finalMax = max;
    let isLimited = false;
    
    if (rangeInYears > 3) {
      // Usar los últimos 3 años
      finalMin = new Date(max.getFullYear() - 2, 0, 1); // 1 enero de hace 3 años
      isLimited = true;
    }
    
    return {
      minDate: format(finalMin, 'yyyy-MM-dd'),
      maxDate: format(finalMax, 'yyyy-MM-dd'),
      isLimitedRange: isLimited
    };
  }, [filteredTransactions]);

  // Datos para el mapa de calor del calendario
  const calendarData = useMemo(() => {
    const minDateObj = new Date(minDate);
    const maxDateObj = new Date(maxDate);
    
    const dailyExpenses = filteredTransactions
      .filter(transaction => 
        transaction.importe < 0 && 
        transaction.fechaContable >= minDateObj && 
        transaction.fechaContable <= maxDateObj
      )
      .reduce((acc, transaction) => {
        const dateStr = format(transaction.fechaContable, 'yyyy-MM-dd');
        acc[dateStr] = (acc[dateStr] || 0) + Math.abs(transaction.importe);
        return acc;
      }, {} as Record<string, number>);

    return Object.entries(dailyExpenses).map(([date, value]) => ({
      day: date,
      value: Math.round(value)
    }));
  }, [filteredTransactions, minDate, maxDate]);

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

      {/* Gráfico Sunburst */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Desglose por Categoría y Subcategoría</Title>
        <Box h={500}>
          <ResponsiveSunburst
            data={sunburstData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            id="name"
            value="value"
            cornerRadius={2}
            borderWidth={2}
            borderColor={{ theme: 'background' }}
            colors={{ scheme: 'category10' }}
            childColor={{ from: 'color', modifiers: [['brighter', 0.1]] }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ theme: 'background' }}
            animate={true}
            motionConfig="gentle"
            tooltip={(props) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${props.color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{props.id}</strong>
                <br />
                <span style={{ color: props.color }}>
                  {formatCurrency(props.value)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>

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

      {/* Mapa de calor del calendario */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Mapa de Calor de Gastos Diarios</Title>
        
        {isLimitedRange && (
          <Box mb="sm">
            <Text size="sm" c="dimmed">
              Mostrando los últimos 3 años para mejor visualización. Rango completo disponible en otros gráficos.
            </Text>
          </Box>
        )}
        
        <Box h={200} style={{ overflow: 'auto' }}>
          <ResponsiveCalendar
            data={calendarData}
            from={minDate}
            to={maxDate}
            emptyColor="#eeeeee"
            colors={[
              '#ffebee',
              '#ffcdd2',
              '#ef9a9a',
              '#e57373',
              '#ef5350',
              '#f44336',
              '#e53935',
              '#d32f2f',
              '#c62828'
            ]}
            margin={{ top: 20, right: 40, bottom: 20, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
            legends={[
              {
                anchor: 'bottom-right',
                direction: 'row',
                translateY: 36,
                itemCount: 4,
                itemWidth: 42,
                itemHeight: 36,
                itemsSpacing: 14,
                itemDirection: 'right-to-left'
              }
            ]}
            tooltip={({ day, value, color }) => (
              <div
                style={{
                  background: 'white',
                  padding: '12px 16px',
                  border: `2px solid ${color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{format(new Date(day), 'dd/MM/yyyy')}</strong>
                <br />
                <span style={{ color }}>
                  Gastos: {value ? formatCurrency(Number(value)) : '0 €'}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>
    </Stack>
  );
}
