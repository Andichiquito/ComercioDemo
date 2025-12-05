import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InvitationModal from './InvitationModal';
import { useState } from 'react';

const ProtectedRoute = ({ children, requireAuth = false, allowedRoles = [], fallback = null }) => {
  const { user, isAuthenticated, hasRole } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Si no requiere autenticación, mostrar el contenido
  if (!requireAuth) {
    return children;
  }

  // Si requiere autenticación pero no está autenticado
  if (!isAuthenticated()) {
    if (fallback) {
      return fallback;
    }
    
    // Mostrar modal de autenticación
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-md">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-4">Acceso Restringido</h2>
            <p className="text-white/80 mb-6">
              Necesitas iniciar sesión para acceder a esta sección.
            </p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
        
        <InvitationModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={() => setShowAuthModal(false)}
          onRegister={() => setShowAuthModal(false)}
        />
      </>
    );
  }

  // Si requiere roles específicos
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(role => hasRole(role));
    
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 flex items-center justify-center p-4">
          <div className="text-center text-white max-w-md">
            <div className="text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
            <p className="text-white/80 mb-6">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-white/60">
              Tu rol actual: <span className="font-semibold">{user?.rol || 'Sin rol'}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  // Si pasa todas las verificaciones, mostrar el contenido
  return children;
};

export default ProtectedRoute;
