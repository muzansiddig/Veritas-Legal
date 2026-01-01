
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import CasePage from './pages/CasePage';
import TasksPage from './pages/TasksPage';
import CalendarPage from './pages/CalendarPage';
import BillingPage from './pages/BillingPage';
import OfflinePage from './pages/OfflinePage';
import Layout from './components/Layout';
import JudgeDashboard from './pages/JudgeDashboard';
import LawyerDashboard from './pages/LawyerDashboard';

// Placeholder for yet-to-be-re-implemented pages
const Placeholder = ({ title }: { title: string }) => (
  <div className="p-8">
    <h2 className="text-2xl font-serif font-bold mb-4">{title}</h2>
    <div className="bg-white p-20 border border-border border-dashed rounded flex items-center justify-center text-muted-foreground italic">
      Judicial module "{title}" is being optimized for Enterprise standards...
    </div>
  </div>
);

function App() {
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const isAuthenticated = !!localStorage.getItem('token');

    if (!isAuthenticated) return <Navigate to="/login" />;

    return <Layout>{children}</Layout>;
  };

  const DashboardDispatcher = () => {
    // Role simulation
    const userRole = "Judge"; // or "Lawyer"
    return userRole === "Judge" ? <JudgeDashboard /> : <LawyerDashboard />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Unified Dashboard Route */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardDispatcher /></ProtectedRoute>} />

        {/* Operations */}
        <Route path="/cases" element={<ProtectedRoute><CasePage /></ProtectedRoute>} />
        <Route path="/evidence" element={<ProtectedRoute><Placeholder title="Evidence Intelligence Library" /></ProtectedRoute>} />
        <Route path="/timeline" element={<ProtectedRoute><Placeholder title="Case Chronology Timeline" /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><TasksPage /></ProtectedRoute>} />

        {/* Insights & Admin */}
        <Route path="/analytics" element={<ProtectedRoute><Placeholder title="Judicial Analytics" /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Placeholder title="System Administration" /></ProtectedRoute>} />
        <Route path="/ai-assistant" element={<ProtectedRoute><Placeholder title="Veritas AI Assistant" /></ProtectedRoute>} />

        {/* Utilities */}
        <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
        <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
        <Route path="/offline" element={<OfflinePage />} />

        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
