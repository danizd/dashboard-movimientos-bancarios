import { useMemo, useState } from 'react';
import { Card, Title, Text, Table, Group, Pagination, Select, ScrollArea, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useFinancialStore } from '../../store/financialStore';
import { format } from 'date-fns';

export default function TransactionsTable() {
  const { filteredTransactions } = useFinancialStore();
  const [activePage, setActivePage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [search, setSearch] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Filtrar transacciones por búsqueda
  const searchedTransactions = useMemo(() => {
    if (!search) return filteredTransactions;
    
    const lowercaseSearch = search.toLowerCase();
    return filteredTransactions.filter(transaction => 
      transaction.concepto.toLowerCase().includes(lowercaseSearch) ||
      transaction.categoria.toLowerCase().includes(lowercaseSearch) ||
      transaction.cuenta.toLowerCase().includes(lowercaseSearch)
    );
  }, [filteredTransactions, search]);

  // Paginación
  const totalPages = Math.ceil(searchedTransactions.length / pageSize);
  const startIndex = (activePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTransactions = searchedTransactions.slice(startIndex, endIndex);

  const rows = paginatedTransactions.map((transaction) => (
    <Table.Tr key={`${transaction.fechaContable.getTime()}-${transaction.concepto}`}>
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

  return (
    <Card withBorder padding="lg" radius="md">
      <Group style={{ justifyContent: 'space-between', marginBottom: 'var(--mantine-spacing-md)' }}>
        <Title order={4}>
          Transacciones ({searchedTransactions.length})
        </Title>
        
        <Group>
          <TextInput
            placeholder="Buscar transacciones..."
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            style={{ width: '250px' }}
          />
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
      </Group>
      
      <ScrollArea>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Fecha</Table.Th>
              <Table.Th>Concepto</Table.Th>
              <Table.Th>Categoría</Table.Th>
              <Table.Th>Importe</Table.Th>
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
