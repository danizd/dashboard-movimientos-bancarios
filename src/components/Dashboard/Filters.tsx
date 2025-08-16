import { Group, Card, Select, MultiSelect } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useFinancialStore } from '../../store/financialStore';

export default function Filters() {
  const { 
    filters, 
    setDateRange, 
    setSelectedAccounts, 
    setTransactionType, 
    setSelectedYear,
    getUniqueAccounts,
    getAvailableYears
  } = useFinancialStore();

  const accounts = getUniqueAccounts();
  const accountOptions = accounts.map(account => ({ value: account, label: account }));
  
  const availableYears = getAvailableYears();
  const yearOptions = [
    { value: 'all', label: 'Todos los años' },
    ...availableYears.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  const transactionTypeOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'income', label: 'Ingresos' },
    { value: 'expense', label: 'Gastos' },
  ];

  return (
    <Card withBorder padding="lg" radius="md">
      <Group style={{ alignItems: 'flex-end', flexWrap: 'wrap', gap: 'var(--mantine-spacing-md)' }}>
        {/* Selector de año */}
        <Select
          label="Año"
          data={yearOptions}
          value={filters.selectedYear?.toString() || 'all'}
          onChange={(value) => setSelectedYear(value === 'all' ? null : parseInt(value || ''))}
          style={{ minWidth: '120px' }}
        />
        
        {/* Selector de rango de fechas */}
        <DatePickerInput
          label="Rango de fechas"
          type="range"
          value={filters.dateRange}
          onChange={(value) => setDateRange(value as [Date | null, Date | null])}
          style={{ minWidth: '300px' }}
          clearable
        />
        
        {/* Selector de cuentas */}
        <MultiSelect
          label="Cuentas"
          placeholder="Todas las cuentas"
          data={accountOptions}
          value={filters.selectedAccounts}
          onChange={setSelectedAccounts}
          style={{ minWidth: '200px' }}
          clearable
          searchable
        />
        
        {/* Selector de tipo de transacción */}
        <Select
          label="Tipo de transacción"
          data={transactionTypeOptions}
          value={filters.transactionType}
          onChange={(value) => setTransactionType(value as 'all' | 'income' | 'expense')}
          style={{ minWidth: '180px' }}
        />
      </Group>
    </Card>
  );
}
