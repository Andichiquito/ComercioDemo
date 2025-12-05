import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ModernHeader from './components/Navigation/ModernHeader';
import DashboardSimple from './components/Dashboard/DashboardSimple';
import InternationalTradePanel from './components/Dashboard/InternationalTradePanel';
import DatosComerciales from './components/DatosComerciales/DatosComerciales';
import GraficosAvanzados from './components/GraficosAvanzados/GraficosAvanzados';
import AnalisisMercados from './components/AnalisisMercados/AnalisisMercados';
import AdminPanel from './components/Admin/AdminPanel';
import InvitationModal from './components/Auth/InvitationModal';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LimitedAccessView from './components/Auth/LimitedAccessView';
import { ToastContainer, useToast } from './components/UI/Toast';
import './App.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [showInvitation, setShowInvitation] = useState(false);
  const [hasSeenInvitation, setHasSeenInvitation] = useState(false);
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    // Mostrar invitación solo si no está autenticado y no la ha visto antes
    if (!loading && !user && !hasSeenInvitation) {
      const timer = setTimeout(() => {
        setShowInvitation(true);
      }, 2000); // Mostrar después de 2 segundos

      return () => clearTimeout(timer);
    }
  }, [loading, user, hasSeenInvitation]);

  const handleCloseInvitation = () => {
    setShowInvitation(false);
    setHasSeenInvitation(true);
  };

  const handleLogin = () => {
    setShowInvitation(false);
    setHasSeenInvitation(true);
  };

  const handleRegister = () => {
    setShowInvitation(false);
    setHasSeenInvitation(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando aplicación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ModernHeader />
      <div className="main-content">
        <Routes>
          {/* Dashboard principal - acceso limitado para invitados */}
          <Route 
            path="/" 
            element={
              <LimitedAccessView showLimitedData={true}>
                <DashboardSimple />
              </LimitedAccessView>
            } 
          />
          
          {/* Panel de comercio - requiere autenticación */}
          <Route 
            path="/panel-comercio" 
            element={
              <ProtectedRoute requireAuth={true}>
                <InternationalTradePanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Datos comerciales - requiere autenticación */}
          <Route 
            path="/datos-comerciales" 
            element={
              <ProtectedRoute requireAuth={true}>
                <DatosComerciales />
              </ProtectedRoute>
            } 
          />
          
          {/* Gráficos avanzados - requiere autenticación */}
          <Route 
            path="/graficos" 
            element={
              <ProtectedRoute requireAuth={true}>
                <GraficosAvanzados />
              </ProtectedRoute>
            } 
          />
          
          {/* Análisis de mercados - requiere autenticación */}
          <Route 
            path="/analisis" 
            element={
              <ProtectedRoute requireAuth={true}>
                <AnalisisMercados />
              </ProtectedRoute>
            } 
          />
          
          {/* Panel de administración - requiere rol de admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAuth={true} allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Página about - acceso público */}
          <Route 
            path="/about" 
            element={
              <div style={{padding: '100px 20px', textAlign: 'center', color: 'white'}}>
                <h1>ℹ️ Quiénes Somos</h1>
                <p>Próximamente...</p>
              </div>
            } 
          />
        </Routes>
      </div>
      
      <InvitationModal
        isOpen={showInvitation}
        onClose={handleCloseInvitation}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
