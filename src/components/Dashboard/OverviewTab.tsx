import { Stack, Card, Title, Box, Text, useMantineTheme } from '@mantine/core';
import { Group } from '@mantine/core';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { useFinancialStore } from '../../store/financialStore';
import KpiCards from './KpiCards';
import { useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval } from 'date-fns';

export default function OverviewTab() {

  const { filteredTransactions } = useFinancialStore();
  const theme = useMantineTheme();

  // Calcular saldo final por cuenta (debe ir después de filteredTransactions)
  const finalBalancesByAccount = useMemo(() => {
    if (filteredTransactions.length === 0) return [];
    // Agrupar por cuenta y tomar la última transacción (por fecha)
    const cuentas = Array.from(new Set(filteredTransactions.map(t => t.cuenta)));
    return cuentas
      .map(cuenta => {
        const transaccionesCuenta = filteredTransactions.filter(t => t.cuenta === cuenta);
        if (transaccionesCuenta.length === 0) return undefined;
        const ultimaTransaccion = transaccionesCuenta.reduce((latest, t) => t.fechaContable > latest.fechaContable ? t : latest, transaccionesCuenta[0]);
        return {
          cuenta,
          saldo: ultimaTransaccion.saldo
        };
      })
      .filter((item): item is { cuenta: string; saldo: number } => !!item);
  }, [filteredTransactions]);

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
  const { balanceEvolutionData, balanceMonthsInfo } = useMemo(() => {
    if (filteredTransactions.length === 0) return { balanceEvolutionData: [], balanceMonthsInfo: { totalMonths: 0, displayedMonths: 0, isLimited: false } };

    const sortedTransactions = [...filteredTransactions].sort((a, b) => 
      a.fechaContable.getTime() - b.fechaContable.getTime()
    );

    const firstDate = sortedTransactions[0].fechaContable;
    const lastDate = sortedTransactions[sortedTransactions.length - 1].fechaContable;
    
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });
    
    // Si hay más de 50 meses (4 años y 2 meses), usar solo los últimos 50 para mejor visualización
    const monthsToShow = months.length > 50 ? months.slice(-50) : months;
    const isLimited = months.length > 50;
    
    const monthlyData = monthsToShow.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      // Para cada cuenta, buscar la PRIMERA transacción en el mes
      // Si no hay, usar la última transacción anterior a ese mes
      const cuentas = Array.from(new Set(sortedTransactions.map(t => t.cuenta)));
      const saldoTotalMes = cuentas.reduce((total, cuenta) => {
        // Buscar la primera transacción de la cuenta en el mes
        const transaccionesEnMes = sortedTransactions.filter(t => t.cuenta === cuenta && t.fechaContable >= monthStart && t.fechaContable <= monthEnd);
        if (transaccionesEnMes.length > 0) {
          // Tomar la transacción más antigua del mes
          const transaccionMasAntigua = transaccionesEnMes.reduce((earliest, t) => t.fechaContable < earliest.fechaContable ? t : earliest, transaccionesEnMes[0]);
          return total + transaccionMasAntigua.saldo;
        } else {
          // Buscar la última transacción anterior al mes
          const transaccionesPrevias = sortedTransactions.filter(t => t.cuenta === cuenta && t.fechaContable < monthStart);
          if (transaccionesPrevias.length === 0) return total;
          const transaccionMasReciente = transaccionesPrevias.reduce((latest, t) => t.fechaContable > latest.fechaContable ? t : latest, transaccionesPrevias[0]);
          return total + transaccionMasReciente.saldo;
        }
      }, 0);

      return {
        x: format(month, 'MMM yyyy'),
        y: Math.round(saldoTotalMes),
      };
    });

    const data = [{
      id: 'saldo',
      color: theme?.colors?.blue?.[6] || '#228be6',
      data: monthlyData,
    }];

    return {
      balanceEvolutionData: data,
      balanceMonthsInfo: {
        totalMonths: months.length,
        displayedMonths: monthsToShow.length,
        isLimited
      }
    };
  }, [filteredTransactions, theme?.colors?.blue]);

  // 2. Datos para gráfico combinado: Ingresos vs Gastos Mensuales + Ahorro
  const { incomeExpenseData, savingsLineData, monthsInfo } = useMemo(() => {
    if (filteredTransactions.length === 0) return { incomeExpenseData: [], savingsLineData: [], monthsInfo: { totalMonths: 0, displayedMonths: 0, isLimited: false } };

    const sortedTransactions = [...filteredTransactions].sort((a, b) => 
      a.fechaContable.getTime() - b.fechaContable.getTime()
    );

    const firstDate = sortedTransactions[0].fechaContable;
    const lastDate = sortedTransactions[sortedTransactions.length - 1].fechaContable;
    
    const months = eachMonthOfInterval({ start: firstDate, end: lastDate });
    
    // Si hay más de 36 meses (3 años), usar solo los últimos 36 para mejor visualización
    const monthsToShow = months.length > 36 ? months.slice(-36) : months;
    const isLimited = months.length > 36;
    
    const monthlyData = monthsToShow.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const monthTransactions = sortedTransactions.filter(t => 
        t.fechaContable >= monthStart && t.fechaContable <= monthEnd
      );
      
      const totalIncome = monthTransactions
        .filter(t => t.importe > 0)
        .reduce((sum, t) => sum + t.importe, 0);
        
      const totalExpenses = Math.abs(monthTransactions
        .filter(t => t.importe < 0)
        .reduce((sum, t) => sum + t.importe, 0));
        
      const savings = totalIncome - totalExpenses;
      const monthLabel = format(month, 'MMM yyyy');
      
      return {
        month: monthLabel,
        ingresos: Math.round(totalIncome),
        gastos: Math.round(totalExpenses),
        ahorro: Math.round(savings)
      };
    });

    // Datos para las barras (ingresos y gastos)
    const barData = monthlyData.map(({ month, ingresos, gastos }) => ({
      month,
      ingresos,
      gastos
    }));

    // Datos para la línea de ahorro
    const lineData = [{
      id: 'ahorro',
      color: theme?.colors?.green?.[6] || '#40c057',
      data: monthlyData.map(({ month, ahorro }) => ({
        x: month,
        y: ahorro
      }))
    }];

    return {
      incomeExpenseData: barData,
      savingsLineData: lineData,
      monthsInfo: {
        totalMonths: months.length,
        displayedMonths: monthsToShow.length,
        isLimited
      }
    };
  }, [filteredTransactions, theme?.colors?.green]);

  return (
    <Stack gap="lg">
      {/* Saldos finales por cuenta como cards estilo KPIs */}
      <Box mb="md">
        <Stack gap="md" style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {finalBalancesByAccount.map(({ cuenta, saldo }) => (
            <Card key={cuenta} withBorder padding="lg" radius="md" className="mantine-Card-root" style={{ minWidth: 220, flex: '1 1 220px' }}>
              <Group style={{ justifyContent: 'space-between' }}>
                <div>
                  <Text size="xs" c="dimmed" style={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    Saldo {cuenta}
                  </Text>
                  <Text size="xl" fw={700} mt="xs" style={{ color: theme.colors.blue[6] }}>
                    {formatCurrency(saldo)}
                  </Text>
                </div>
                {/* Icono opcional, se puede usar IconWallet si se desea */}
              </Group>
            </Card>
          ))}
        </Stack>
      </Box>
      {/* Tarjetas de KPIs */}
      <KpiCards />

      {/* Gráfico combinado: Ingresos vs Gastos + Ahorro */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Ingresos vs. Gastos Mensuales + Ahorro Neto</Title>
        {monthsInfo.isLimited && (
          <Text size="sm" c="dimmed" mb="md">
            📊 Mostrando últimos 36 meses para mejor legibilidad ({monthsInfo.displayedMonths} de {monthsInfo.totalMonths} meses totales)
          </Text>
        )}
        <Box h={500} style={{ position: 'relative' }}>
          {/* Gráfico de barras para ingresos y gastos */}
          <ResponsiveBar
            data={incomeExpenseData}
            keys={['ingresos', 'gastos']}
            indexBy="month"
            margin={{ top: 80, right: 50, bottom: 60, left: 80 }}
            padding={0.3}
            groupMode="grouped"
            colors={[theme?.colors?.green?.[6] || '#40c057', theme?.colors?.red?.[6] || '#fa5252']}
            borderRadius={4}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.3]] }}
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
            enableLabel={false}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'top',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -60,
                itemsSpacing: 20,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 18,
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
                <strong>{data.month} - {id}</strong>
                <br />
                <span style={{ color }}>
                  {formatCurrency(value)}
                </span>
              </div>
            )}
          />
          
          {/* Línea de ahorro superpuesta */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none'
          }}>
            <ResponsiveLine
              data={savingsLineData}
              margin={{ top: 80, right: 50, bottom: 60, left: 80 }}
              xScale={{ type: 'point' }}
              yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
              curve="catmullRom"
              axisTop={null}
              axisRight={{
                tickSize: 5,
                tickPadding: 5,
                format: (value) => formatCurrency(value),
                legend: 'Ahorro Neto',
                legendOffset: 40,
                legendPosition: 'middle'
              }}
              axisBottom={null}
              axisLeft={null}
              colors={[theme?.colors?.blue?.[6] || '#228be6']}
              pointSize={6}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              enablePoints={true}
              enableArea={false}
              lineWidth={3}
              enableGridX={false}
              enableGridY={false}
              enableCrosshair={false}
              useMesh={false}
              animate={true}
              motionConfig="gentle"
              legends={[
                {
                  anchor: 'top',
                  direction: 'row',
                  justify: false,
                  translateX: 120,
                  translateY: -60,
                  itemsSpacing: 20,
                  itemWidth: 100,
                  itemHeight: 20,
                  itemDirection: 'left-to-right',
                  itemOpacity: 0.85,
                  symbolSize: 18,
                  symbolShape: 'circle',
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
              tooltip={({ point }) => (
                <div
                  style={{
                    background: 'white',
                    padding: '12px 16px',
                    border: `2px solid ${theme?.colors?.blue?.[6] || '#228be6'}`,
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    pointerEvents: 'auto'
                  }}
                >
                  <strong>{point.data.xFormatted}</strong>
                  <br />
                  <span style={{ color: theme?.colors?.blue?.[6] || '#228be6' }}>
                    Ahorro: {formatCurrency(point.data.y as number)}
                  </span>
                </div>
              )}
            />
          </div>
        </Box>
      </Card>

      {/* Evolución del saldo */}
      <Card withBorder padding="lg" radius="md">
        <Title order={4} mb="md">Evolución del Saldo por Mes</Title>
        {balanceMonthsInfo.isLimited && (
          <Text size="sm" c="dimmed" mb="md">
            📊 Mostrando últimos 36 meses para mejor legibilidad ({balanceMonthsInfo.displayedMonths} de {balanceMonthsInfo.totalMonths} meses totales)
          </Text>
        )}
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
                  border: `2px solid ${point.color}`,
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <strong>{point.data.xFormatted}</strong>
                <br />
                <span style={{ color: point.color }}>
                  Saldo: {formatCurrency(point.data.y as number)}
                </span>
              </div>
            )}
          />
        </Box>
      </Card>
    </Stack>
  );
}
