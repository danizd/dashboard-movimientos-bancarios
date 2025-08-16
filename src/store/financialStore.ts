import { create } from 'zustand';
import type { Transaction, FilterState } from '../types/transaction';
import { isWithinInterval, getYear } from 'date-fns';

interface FinancialStore {
  // Estado de datos
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Estado de filtros
  filters: FilterState;
  
  // Acciones para manejo de datos
  setTransactions: (transactions: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Acciones para filtros
  setDateRange: (dateRange: [Date | null, Date | null]) => void;
  setSelectedAccounts: (accounts: string[]) => void;
  setTransactionType: (type: 'all' | 'income' | 'expense') => void;
  setSelectedYear: (year: number | null) => void;
  
  // Utilidades
  applyFilters: () => void;
  getUniqueAccounts: () => string[];
  getAvailableYears: () => number[];
  clearData: () => void;
}

export const useFinancialStore = create<FinancialStore>((set, get) => ({
  // Estado inicial
  transactions: [],
  filteredTransactions: [],
  isLoading: false,
  error: null,
  
  filters: {
    dateRange: [null, null],
    selectedAccounts: [],
    transactionType: 'all',
    selectedYear: null,
  },
  
  // Implementación de acciones
  setTransactions: (transactions) => {
    set({ transactions });
    
    // NO seleccionar automáticamente ningún año - mostrar todos por defecto
    // Los usuarios pueden filtrar por año específico si lo desean
    set((state) => ({
      filters: { ...state.filters, selectedYear: null }
    }));
    
    // Aplicar filtros automáticamente cuando se cargan nuevos datos
    get().applyFilters();
  },
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
  
  setDateRange: (dateRange) => {
    set((state) => ({
      filters: { ...state.filters, dateRange }
    }));
    get().applyFilters();
  },
  
  setSelectedAccounts: (selectedAccounts) => {
    set((state) => ({
      filters: { ...state.filters, selectedAccounts }
    }));
    get().applyFilters();
  },
  
  setTransactionType: (transactionType) => {
    set((state) => ({
      filters: { ...state.filters, transactionType }
    }));
    get().applyFilters();
  },
  
  setSelectedYear: (selectedYear) => {
    set((state) => ({
      filters: { ...state.filters, selectedYear }
    }));
    get().applyFilters();
  },
  
  applyFilters: () => {
    const { transactions, filters } = get();
    
    let filtered = transactions;
    
    // Filtrar por año seleccionado
    if (filters.selectedYear !== null) {
      filtered = filtered.filter(transaction =>
        getYear(transaction.fechaContable) === filters.selectedYear
      );
    }
    
    // Filtrar por rango de fechas
    if (filters.dateRange[0] && filters.dateRange[1]) {
      filtered = filtered.filter(transaction =>
        isWithinInterval(transaction.fechaContable, {
          start: filters.dateRange[0]!,
          end: filters.dateRange[1]!
        })
      );
    }
    
    // Filtrar por cuentas seleccionadas
    if (filters.selectedAccounts.length > 0) {
      filtered = filtered.filter(transaction =>
        filters.selectedAccounts.includes(transaction.cuenta)
      );
    }
    
    // Filtrar por tipo de transacción
    if (filters.transactionType === 'income') {
      filtered = filtered.filter(transaction => transaction.importe > 0);
    } else if (filters.transactionType === 'expense') {
      filtered = filtered.filter(transaction => transaction.importe < 0);
    }
    
    set({ filteredTransactions: filtered });
  },
  
  getUniqueAccounts: () => {
    const { transactions } = get();
    const accounts = transactions.map(t => t.cuenta);
    return Array.from(new Set(accounts)).filter(Boolean);
  },
  
  getAvailableYears: () => {
    const { transactions } = get();
    const years = transactions.map(t => getYear(t.fechaContable));
    return Array.from(new Set(years)).sort((a, b) => b - a); // Años ordenados de más reciente a más antiguo
  },
  
  clearData: () => set({
    transactions: [],
    filteredTransactions: [],
    isLoading: false,
    error: null,
    filters: {
      dateRange: [null, null],
      selectedAccounts: [],
      transactionType: 'all',
      selectedYear: null,
    },
  }),
}));
