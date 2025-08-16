import { useFinancialStore } from './store/financialStore';
import Layout from './components/Layout/Layout';
import FileUploader from './components/FileUploader/FileUploader';
import DashboardView from './components/Dashboard/DashboardView';

function App() {
  const { transactions, isLoading } = useFinancialStore();
  
  // Si no hay transacciones cargadas, mostrar el uploader
  if (transactions.length === 0 && !isLoading) {
    return (
      <Layout>
        <FileUploader />
      </Layout>
    );
  }
  
  // Una vez que hay datos, mostrar el dashboard
  return (
    <Layout>
      <DashboardView />
    </Layout>
  );
}

export default App;
