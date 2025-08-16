import { useFinancialStore } from './store/financialStore';
import Layout from './components/Layout/Layout';
import FileUploader from './components/FileUploader/FileUploader';
import TabbedDashboardView from './components/Dashboard/TabbedDashboardView';

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
      <TabbedDashboardView />
    </Layout>
  );
}

export default App;
