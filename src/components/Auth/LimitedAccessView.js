import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import InvitationModal from './InvitationModal';
import { useState } from 'react';

const LimitedAccessView = ({ children, showLimitedData = true }) => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Si está autenticado, mostrar el contenido completo
  if (isAuthenticated()) {
    return children;
  }

  // Si no está autenticado, mostrar vista limitada
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-800 via-red-700 to-red-900 p-6">
      {/* Header con información limitada */}
      <div className="text-center text-white mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <img 
            src="/download.png" 
            alt="Universidad del Valle" 
            className="h-16 w-auto"
          />
          <h1 className="text-4xl font-bold">Universidad del Valle</h1>
        </div>
        <p className="text-xl text-white/80">Dashboard de Comercio Internacional</p>
      </div>

      {/* Mensaje de acceso limitado */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-center text-white">
          <div className="text-4xl mb-4">👀</div>
          <h2 className="text-2xl font-bold mb-4">Vista de Invitado</h2>
          <p className="text-white/80 mb-6">
            Estás viendo una versión limitada del dashboard. Para acceder a todos los datos y funcionalidades, 
            inicia sesión o crea una cuenta gratuita.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              🔐 Iniciar Sesión
            </button>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              📝 Crear Cuenta
            </button>
          </div>
        </div>
      </div>

      {/* Datos limitados si se especifica */}
      {showLimitedData && (
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Estadísticas básicas */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">📊 Estadísticas Generales</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Operaciones:</span>
                  <span className="font-bold">76,360</span>
                </div>
                <div className="flex justify-between">
                  <span>Valor Total:</span>
                  <span className="font-bold">$64.6B USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Países Destino:</span>
                  <span className="font-bold">100+</span>
                </div>
              </div>
            </div>

            {/* Top países */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">🌍 Top Países</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>1. Brasil</span>
                  <span className="text-sm">$9.7B</span>
                </div>
                <div className="flex justify-between">
                  <span>2. Estados Unidos</span>
                  <span className="text-sm">$8.2B</span>
                </div>
                <div className="flex justify-between">
                  <span>3. México</span>
                  <span className="text-sm">$6.1B</span>
                </div>
              </div>
            </div>

            {/* Medios de transporte */}
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">🚚 Transporte</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Marítimo</span>
                  <span className="text-sm">65%</span>
                </div>
                <div className="flex justify-between">
                  <span>Aéreo</span>
                  <span className="text-sm">25%</span>
                </div>
                <div className="flex justify-between">
                  <span>Terrestre</span>
                  <span className="text-sm">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mensaje de upgrade */}
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-md rounded-lg p-6 text-center text-white border border-yellow-500/30">
            <h3 className="text-xl font-bold mb-2">🚀 Desbloquea Todo el Potencial</h3>
            <p className="text-white/80 mb-4">
              Con una cuenta gratuita obtienes acceso a:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Datos en tiempo real</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Gráficos interactivos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Análisis avanzados</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Filtros personalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Exportación de datos</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span>Soporte prioritario</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de autenticación */}
      <InvitationModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => setShowAuthModal(false)}
        onRegister={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default LimitedAccessView;
