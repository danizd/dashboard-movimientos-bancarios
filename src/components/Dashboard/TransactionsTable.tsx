import { useMemo, useState, useCallback, useEffect } from 'react';
import { Card, Title, Text, Table, Group, Pagination, Select, ScrollArea, TextInput, MultiSelect, Button, Badge, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSearch, IconX, IconCalendar, IconFilterOff, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useFinancialStore } from '../../store/financialStore';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import type { Transaction } from '../../types/transaction';

export default function TransactionsTable() {
  const { filteredTransactions } = useFinancialStore();
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Date presets
  const datePresets = {
    thisMonth: {
      label: 'Este mes',
      value: [startOfMonth(new Date()), endOfMonth(new Date())] as [Date, Date]
    },
    lastMonth: {
      label: 'Mes pasado',
      value: [startOfMonth(subMonths(new Date(), 1)), endOfMonth(subMonths(new Date(), 1))] as [Date, Date]
    },
    thisYear: {
      label: 'Este año',
      value: [startOfYear(new Date()), endOfYear(new Date())] as [Date, Date]
    }
  };

  // Get unique categories
  const uniqueCategories = useMemo(() => {
    const categories = new Set(filteredTransactions.map(t => t.categoria));
    return Array.from(categories).filter(Boolean).sort();
  }, [filteredTransactions]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearch('');
    setSelectedCategories([]);
    setDateRange([null, null]);
    setSortOrder(null);
    setActivePage(1);
  }, []);

  // Handle sort by amount
  const handleSortByAmount = useCallback(() => {
    if (sortOrder === null) {
      setSortOrder('desc'); // First click: highest to lowest
    } else if (sortOrder === 'desc') {
      setSortOrder('asc'); // Second click: lowest to highest
    } else {
      setSortOrder(null); // Third click: no sorting
    }
  }, [sortOrder]);

  // Apply date preset
  const applyDatePreset = useCallback((preset: keyof typeof datePresets) => {
    setDateRange(datePresets[preset].value);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Filtrar transacciones por búsqueda, categoría y fecha
  const searchedTransactions = useMemo(() => {
    let filtered = filteredTransactions;

    // Text search
    if (debouncedSearch.trim()) {
      const searchTerm = debouncedSearch.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.concepto.toLowerCase().includes(searchTerm) ||
        transaction.categoria.toLowerCase().includes(searchTerm) ||
        transaction.cuenta.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(transaction =>
        selectedCategories.includes(transaction.categoria)
      );
    }

    // Date range filter
    if (dateRange[0] && dateRange[1]) {
      const startDate = new Date(dateRange[0]);
      startDate.setHours(0, 0, 0, 0); // Start of day
      
      const endDate = new Date(dateRange[1]);
      endDate.setHours(23, 59, 59, 999); // End of day
      
      filtered = filtered.filter(transaction => {
        // transaction.fechaContable ya es un objeto Date
        const transactionDate = transaction.fechaContable;
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    // Sort by amount
    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        // Asegurar que los importes sean números válidos
        const importeA = typeof a.importe === 'number' && !isNaN(a.importe) ? a.importe : 0;
        const importeB = typeof b.importe === 'number' && !isNaN(b.importe) ? b.importe : 0;
        
        if (sortOrder === 'asc') {
          return importeA - importeB;
        } else {
          return importeB - importeA;
        }
      });
    }

    return filtered;
  }, [filteredTransactions, debouncedSearch, selectedCategories, dateRange, sortOrder]);

  // Reset page when filters change
  useEffect(() => {
    setActivePage(1);
  }, [debouncedSearch, selectedCategories, dateRange, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(searchedTransactions.length / pageSize);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = searchedTransactions.slice(startIndex, endIndex);

  // Función para generar ID único para cada transacción
  const generateTransactionKey = (transaction: Transaction, index: number) => {
    const baseKey = `${transaction.fechaContable.getTime()}-${transaction.fechaValor.getTime()}-${transaction.concepto}-${transaction.importe}-${transaction.saldo}-${transaction.cuenta}`;
    return `${baseKey}-${index}`;
  };

  const rows = paginatedTransactions.map((transaction, index) => (
    <Table.Tr key={generateTransactionKey(transaction, index)}>
      <Table.Td>
        <Text size="sm">
          {format(transaction.fechaContable, 'dd/MM/yyyy')}
        </Text>
      </Table.Td>
      <Table.Td style={{ maxWidth: '300px' }}>
        <Text size="sm" truncate title={transaction.concepto}>
          {transaction.concepto}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c={transaction.categoria === 'Sin categoría' ? 'dimmed' : 'dark'}>
          {transaction.categoria || 'Sin categoría'}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text
          size="sm"
          fw={500}
          c={transaction.importe > 0 ? 'green' : 'red'}
        >
          {formatCurrency(transaction.importe)}
        </Text>
      </Table.Td>
      <Table.Td>
        <Text size="sm" c="dimmed">
          {transaction.cuenta}
        </Text>
      </Table.Td>
    </Table.Tr>
  ));

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (debouncedSearch.trim()) count++;
    if (selectedCategories.length > 0) count++;
    if (dateRange[0] && dateRange[1]) count++;
    if (sortOrder) count++;
    return count;
  }, [debouncedSearch, selectedCategories, dateRange, sortOrder]);

  return (
    <Card withBorder padding="lg" radius="md">
      <Stack gap="md">
        {/* Header */}
        <Group style={{ justifyContent: 'space-between' }}>
          <Title order={4}>
            Transacciones ({searchedTransactions.length})
          </Title>
          <Select
            value={pageSize.toString()}
            onChange={(value) => {
              setPageSize(parseInt(value || '50'));
              setActivePage(1);
            }}
            data={[
              { value: '25', label: '25 por página' },
              { value: '50', label: '50 por página' },
              { value: '100', label: '100 por página' },
              { value: '200', label: '200 por página' },
            ]}
            style={{ width: '150px' }}
          />
        </Group>

        {/* Filters */}
        <Stack gap="sm">
          <Group grow>
            <TextInput
              placeholder="Buscar por concepto, categoría o cuenta..."
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
            />
            <MultiSelect
              placeholder="Filtrar por categorías"
              data={uniqueCategories}
              value={selectedCategories}
              onChange={setSelectedCategories}
              searchable
              clearable
            />
          </Group>
          
          <Group>
            <DatePickerInput
              type="range"
              placeholder="Seleccionar rango de fechas"
              value={dateRange}
              onChange={(value) => setDateRange(value as [Date | null, Date | null])}
              leftSection={<IconCalendar size={16} />}
              style={{ flex: 1 }}
            />
            <Group gap="xs">
              {Object.entries(datePresets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="light"
                  size="sm"
                  onClick={() => applyDatePreset(key as keyof typeof datePresets)}
                >
                  {preset.label}
                </Button>
              ))}
            </Group>
          </Group>
        </Stack>

        {/* Active Filters & Reset */}
        {activeFiltersCount > 0 && (
          <Group>
            <Text size="sm" c="dimmed">
              Filtros activos:
            </Text>
            {debouncedSearch.trim() && (
              <Badge variant="light" color="blue" rightSection={
                <IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setSearch('')} />
              }>
                Búsqueda: "{debouncedSearch}"
              </Badge>
            )}
            {selectedCategories.length > 0 && (
              <Badge variant="light" color="green" rightSection={
                <IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategories([])} />
              }>
                Categorías: {selectedCategories.length}
              </Badge>
            )}
            {dateRange[0] && dateRange[1] && (
              <Badge variant="light" color="orange" rightSection={
                <IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setDateRange([null, null])} />
              }>
                Fechas: {format(dateRange[0], 'dd/MM')} - {format(dateRange[1], 'dd/MM')}
              </Badge>
            )}
            {sortOrder && (
              <Badge variant="light" color="purple" rightSection={
                <IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setSortOrder(null)} />
              }>
                Ordenado: {sortOrder === 'desc' ? 'Mayor a menor' : 'Menor a mayor'}
              </Badge>
            )}
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconFilterOff size={14} />}
              onClick={clearFilters}
            >
              Limpiar filtros
            </Button>
          </Group>
        )}
      </Stack>
      
      <ScrollArea>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Concepto</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th 
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={handleSortByAmount}
              >
                <Group gap={4} wrap="nowrap">
                  <Text>Importe</Text>
                  {sortOrder === 'desc' && <IconChevronDown size={14} />}
                  {sortOrder === 'asc' && <IconChevronUp size={14} />}
                </Group>
              </Table.Th>
              <Table.Th>Cuenta</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </ScrollArea>

      {totalPages > 1 && (
        <Group style={{ justifyContent: 'center', marginTop: 'var(--mantine-spacing-md)' }}>
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}
    </Card>
  );
}
