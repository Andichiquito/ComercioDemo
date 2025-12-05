import React, { useState } from 'react';
import { FaStar, FaGlobe, FaChartBar, FaSearch, FaChartLine, FaBriefcase, FaLock, FaUserPlus, FaEye } from 'react-icons/fa';
import Login from './Login';
import Register from './Register';
import './Auth.css';

const InvitationModal = ({ isOpen, onClose, onLogin, onRegister }) => {
  const [currentView, setCurrentView] = useState('invitation'); // 'invitation', 'login', 'register'

  if (!isOpen) return null;

  const handleClose = () => {
    setCurrentView('invitation');
    onClose();
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const handleSwitchToRegister = () => {
    setCurrentView('register');
  };

  const handleBackToInvitation = () => {
    setCurrentView('invitation');
  };

  const handleLoginSuccess = () => {
    onLogin();
    handleClose();
  };

  const handleRegisterSuccess = () => {
    onRegister();
    handleClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
        {currentView === 'invitation' && (
          <>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">
                <FaStar className="inline mr-2" />
                ¡Bienvenido a GlobalTrade Analytics!
              </h3>
              <button onClick={handleClose} className="auth-modal-close">
                ×
              </button>
            </div>
            
            <div className="auth-modal-body">
              <div className="invitation-content">
                <div className="invitation-icon">
                  <div className="floating-icon"><FaGlobe /></div>
                </div>
                
                <div className="invitation-text">
                  <h4 className="text-xl font-bold text-white mb-4">
                    Descubre el poder de los datos comerciales
                  </h4>
                  
                  <div className="features-list">
                    <div className="feature-item">
                      <span className="feature-icon"><FaChartBar /></span>
                      <span>Dashboard interactivo con datos en tiempo real</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon"><FaSearch /></span>
                      <span>Análisis detallado de mercados internacionales</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon"><FaChartLine /></span>
                      <span>Gráficos avanzados y reportes personalizados</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon"><FaBriefcase /></span>
                      <span>Herramientas para empresas y analistas</span>
                    </div>
                  </div>
                  
                  <div className="access-options">
                    <p className="text-white/80 text-sm mb-4">
                      Para acceder a todas las funcionalidades:
                    </p>
                    
                    <div className="button-group">
                      <button
                        onClick={handleSwitchToLogin}
                        className="auth-button primary w-full mb-3"
                      >
                        <FaLock className="inline mr-2" /> Iniciar Sesión
                      </button>
                      
                      <button
                        onClick={handleSwitchToRegister}
                        className="auth-button secondary w-full mb-3"
                      >
                        <FaUserPlus className="inline mr-2" /> Crear Cuenta Gratis
                      </button>
                      
                      <button
                        onClick={handleClose}
                        className="link-button w-full text-center"
                      >
                        <FaEye className="inline mr-2" /> Continuar como visitante
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'login' && (
          <>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">
                <FaLock className="inline mr-2" />
                Iniciar Sesión
              </h3>
              <div className="flex gap-2">
                <button onClick={handleBackToInvitation} className="auth-modal-close">
                  ←
                </button>
                <button onClick={handleClose} className="auth-modal-close">
                  ×
                </button>
              </div>
            </div>
            
            <div className="auth-modal-body">
              <Login 
                onSwitchToRegister={handleSwitchToRegister}
                onClose={handleLoginSuccess}
              />
            </div>
          </>
        )}

        {currentView === 'register' && (
          <>
            <div className="auth-modal-header">
              <h3 className="auth-modal-title">
                <FaUserPlus className="inline mr-2" />
                Crear Cuenta
              </h3>
              <div className="flex gap-2">
                <button onClick={handleBackToInvitation} className="auth-modal-close">
                  ←
                </button>
                <button onClick={handleClose} className="auth-modal-close">
                  ×
                </button>
              </div>
            </div>
            
            <div className="auth-modal-body">
              <Register 
                onSwitchToLogin={handleSwitchToLogin}
                onClose={handleRegisterSuccess}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InvitationModal;
