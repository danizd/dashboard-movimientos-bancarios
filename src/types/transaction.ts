export interface Transaction {
  fechaContable: Date;
  fechaValor: Date;
  concepto: string;
  importe: number;
  moneda: string;
  saldo: number;
  conceptoAmpliado: string;
  categoria: string;
  subcategoria: string;
  cuenta: string;
}

export interface RawTransaction {
  'Fecha contable': string;
  'Fecha valor': string;
  'Concepto': string;
  'Importe': string;
  'Moneda': string;
  'Saldo': string;
  'Concepto ampliado': string;
  'Categoria': string;
  'Subcategoria': string;
  'cuenta': string;
}

export interface FilterState {
  dateRange: [Date | null, Date | null];
  selectedAccounts: string[];
  transactionType: 'all' | 'income' | 'expense';
  selectedYear: number | null;
}

export interface KpiData {
  finalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

export interface CategoryExpense {
  categoria: string;
  total: number;
}

export interface ChartDataPoint {
  x: string | Date;
  y: number;
}
