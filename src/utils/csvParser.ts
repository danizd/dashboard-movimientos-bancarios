import Papa from 'papaparse';
import { parse } from 'date-fns';
import type { Transaction, RawTransaction } from '../types/transaction';

/**
 * Parsea una fecha en formato DD-MM-YYYY a objeto Date
 */
function parseDate(dateString: string): Date {
  return parse(dateString, 'dd-MM-yyyy', new Date());
}

/**
 * Convierte un string con coma decimal a número
 */
function parseNumber(numberString: string): number {
  if (!numberString || numberString.trim() === '') return 0;
  return parseFloat(numberString.replace(',', '.'));
}

/**
 * Mapea una fila raw del CSV a una transacción tipada
 */
function mapRawToTransaction(raw: RawTransaction): Transaction {
  return {
    fechaContable: parseDate(raw['Fecha contable']),
    fechaValor: parseDate(raw['Fecha valor']),
    concepto: raw['Concepto']?.trim() || '',
    importe: parseNumber(raw['Importe']),
    moneda: raw['Moneda']?.trim() || '',
    saldo: parseNumber(raw['Saldo']),
    conceptoAmpliado: raw['Concepto ampliado']?.trim() || '',
    categoria: raw['Categoria']?.trim() || 'Sin categoría',
    subcategoria: raw['Subcategoria']?.trim() || '',
    cuenta: raw['cuenta']?.trim() || '',
  };
}

/**
 * Procesa el contenido del archivo CSV y retorna las transacciones
 */
export function parseCSVContent(csvContent: string): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawTransaction>(csvContent, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      complete: (results) => {
        try {
          if (results.errors.length > 0) {
            console.warn('Errores en el parseo del CSV:', results.errors);
          }
          
          const transactions = results.data
            .filter((row) => {
              // Filtrar filas vacías o con datos incompletos
              return row['Fecha contable'] && row['Importe'] !== undefined;
            })
            .map(mapRawToTransaction)
            .filter((transaction) => {
              // Filtrar transacciones con fechas inválidas
              return !isNaN(transaction.fechaContable.getTime());
            });
          
          // Ordenar por fecha (más reciente primero)
          transactions.sort((a, b) => b.fechaContable.getTime() - a.fechaContable.getTime());
          
          resolve(transactions);
        } catch (error) {
          reject(new Error(`Error al procesar el CSV: ${error instanceof Error ? error.message : 'Error desconocido'}`));
        }
      },
      error: (error: Error) => {
        reject(new Error(`Error al parsear el CSV: ${error.message}`));
      },
    });
  });
}

/**
 * Lee un archivo File y retorna su contenido como string
 */
export function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        resolve(content);
      } else {
        reject(new Error('No se pudo leer el contenido del archivo'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * Procesa un archivo CSV completo: lectura + parseo
 */
export async function processCSVFile(file: File): Promise<Transaction[]> {
  const content = await readFileContent(file);
  return parseCSVContent(content);
}
