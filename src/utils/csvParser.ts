import Papa from 'papaparse';
import { parse } from 'date-fns';
import type { Transaction, RawTransaction } from '../types/transaction';

/**
 * Parsea una fecha en formato DD-MM-YYYY o DD/MM/YYYY a objeto Date
 */
function parseDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  // Limpiar espacios en blanco
  const cleanedDate = dateString.trim();
  
  // Intentar con formato DD/MM/YYYY (barras)
  if (cleanedDate.includes('/')) {
    const parsed = parse(cleanedDate, 'dd/MM/yyyy', new Date());
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Intentar con formato DD-MM-YYYY (guiones)
  if (cleanedDate.includes('-')) {
    const parsed = parse(cleanedDate, 'dd-MM-yyyy', new Date());
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
  }
  
  // Si ningún formato funciona, devolver fecha actual como fallback
  console.warn(`No se pudo parsear la fecha: "${dateString}"`);
  return new Date();
}

/**
 * Convierte un string con coma decimal a número
 */
function parseNumber(numberString: string): number {
  if (!numberString || numberString.trim() === '') return 0;
  
  // Limpiar el string: remover espacios y reemplazar coma por punto
  const cleanedString = numberString.trim().replace(',', '.');
  
  // Parsear y validar
  const parsed = parseFloat(cleanedString);
  
  // Si el resultado es NaN, devolver 0
  return isNaN(parsed) ? 0 : parsed;
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
          
          const validTransactions = results.data
            .filter((row) => {
              // Filtrar filas vacías o con datos incompletos
              const isValid = row['Fecha contable'] && row['Importe'] !== undefined;
              if (!isValid) {
                console.debug('Fila filtrada por datos incompletos:', row);
              }
              return isValid;
            })
            .map(mapRawToTransaction)
            .filter((transaction) => {
              // Filtrar transacciones con fechas inválidas
              const dateIsValid = !isNaN(transaction.fechaContable.getTime());
              if (!dateIsValid) {
                console.warn('Transacción filtrada por fecha inválida:', transaction);
              }
              return dateIsValid;
            });
          
          console.log(`CSV procesado: ${results.data.length} filas brutas → ${validTransactions.length} transacciones válidas`);
          
          // Ordenar por fecha (más reciente primero)
          validTransactions.sort((a, b) => b.fechaContable.getTime() - a.fechaContable.getTime());
          
          resolve(validTransactions);
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
