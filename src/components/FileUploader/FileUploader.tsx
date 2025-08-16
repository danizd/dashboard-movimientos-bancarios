import { useState, useCallback } from 'react';
import { 
  Group, 
  Text, 
  rem, 
  Stack, 
  Button, 
  Alert, 
  LoadingOverlay, 
  Card,
  Title,
  Center
} from '@mantine/core';
import { Dropzone, MIME_TYPES } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile, IconAlertCircle } from '@tabler/icons-react';
import { useFinancialStore } from '../../store/financialStore';
import { processCSVFile } from '../../utils/csvParser';

export default function FileUploader() {
  const { setTransactions, setLoading, setError, isLoading, error } = useFinancialStore();
  const [dragActive, setDragActive] = useState(false);

  const handleFileDrop = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    
    // Validar que sea un archivo CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Por favor, selecciona un archivo CSV válido.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Procesar el archivo CSV
      const transactions = await processCSVFile(file);
      
      if (transactions.length === 0) {
        setError('El archivo CSV no contiene transacciones válidas.');
        return;
      }
      
      // Guardar las transacciones en el store
      setTransactions(transactions);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al procesar el archivo';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setTransactions, setLoading, setError]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileDrop(Array.from(files));
    }
  };

  return (
    <Center style={{ minHeight: '70vh', padding: 'var(--mantine-spacing-md)' }}>
      <Card shadow="sm" padding="xl" radius="md" style={{ width: '100%', maxWidth: '700px' }}>
        <Stack style={{ gap: 'var(--mantine-spacing-lg)' }}>
          <div style={{ textAlign: 'center' }}>
            <Title order={2} mb="xs">
              Carga tu archivo de transacciones
            </Title>
            <Text c="dimmed">
              Arrastra y suelta tu archivo CSV o haz clic para seleccionarlo
            </Text>
          </div>

          <div style={{ position: 'relative' }}>
            <LoadingOverlay visible={isLoading} />
            
            <Dropzone
              onDrop={handleFileDrop}
              onReject={() => setError('Archivo no válido. Solo se permiten archivos CSV.')}
              maxSize={5 * 1024 ** 2} // 5MB
              accept={[MIME_TYPES.csv]}
              style={{
                border: dragActive ? '2px dashed var(--mantine-color-blue-6)' : '2px dashed var(--mantine-color-gray-4)',
                backgroundColor: dragActive ? 'var(--mantine-color-blue-0)' : 'transparent',
                transition: 'all 0.2s ease',
                padding: '2rem',
                borderRadius: 'var(--mantine-radius-md)',
              }}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
            >
              <Group style={{ justifyContent: 'center', minHeight: rem(120) }}>
                <Dropzone.Accept>
                  <IconUpload
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconFile
                    style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <div style={{ textAlign: 'center' }}>
                  <Text size="xl" inline>
                    Arrastra tu archivo CSV aquí o haz clic para seleccionar
                  </Text>
                  <Text size="sm" c="dimmed" inline mt={7}>
                    El archivo debe tener un tamaño máximo de 5MB
                  </Text>
                </div>
              </Group>
            </Dropzone>
          </div>

          {/* Input alternativo para seleccionar archivo */}
          <Center>
            <label htmlFor="file-input">
              <Button component="span" variant="outline">
                Seleccionar archivo desde el ordenador
              </Button>
            </label>
            <input
              id="file-input"
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
          </Center>

          {/* Mostrar errores */}
          {error && (
            <Alert icon={<IconAlertCircle size="1rem" />} color="red">
              {error}
            </Alert>
          )}

          {/* Información sobre el formato esperado */}
          <Card withBorder padding="md" style={{ backgroundColor: 'var(--mantine-color-gray-0)' }}>
            <Text size="sm" fw={500} mb="xs">
              Formato de archivo esperado:
            </Text>
            <Text size="xs" c="dimmed">
              • Archivo CSV con separador punto y coma (;)
              <br />
              • Cabeceras: Fecha contable, Fecha valor, Concepto, Importe, Moneda, Saldo, etc.
              <br />
              • Fechas en formato DD-MM-YYYY
              <br />
              • Números con coma decimal (ej: 1.234,56)
            </Text>
          </Card>
        </Stack>
      </Card>
    </Center>
  );
}
