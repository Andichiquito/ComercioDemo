import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import ThemeToggle from '../Theme/ThemeToggle';
import './Navigation.css';

const Navigation = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
  };

  const handleLoginSuccess = () => {
    setShowLogin(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  return (
    <>
      <nav className="navigation">
        <div className="nav-container">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              🌍 GlobalTrade Analytics
            </Link>
          </div>
          
          <div className="nav-menu">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/panel-comercio" 
              className={`nav-link ${location.pathname === '/panel-comercio' ? 'active' : ''}`}
            >
              🌍 Panel Comercio
            </Link>
            <Link 
              to="/datos-comerciales" 
              className={`nav-link ${location.pathname === '/datos-comerciales' ? 'active' : ''}`}
            >
              📋 Datos Comerciales
            </Link>
            <Link 
              to="/graficos" 
              className={`nav-link ${location.pathname === '/graficos' ? 'active' : ''}`}
            >
              📈 Gráficos Avanzados
            </Link>
            <Link 
              to="/analisis" 
              className={`nav-link ${location.pathname === '/analisis' ? 'active' : ''}`}
            >
              🔍 Análisis de Mercados
            </Link>
            {isAdmin() && (
              <Link 
                to="/admin" 
                className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                ⚙️ Administración
              </Link>
            )}
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              ℹ️ Quiénes Somos
            </Link>
          </div>
          
          <div className="nav-actions">
            <ThemeToggle />
            {user ? (
              <div className="user-menu-container">
                <button 
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {user.nombre?.charAt(0).toUpperCase()}
                  </span>
                  <span className="user-name">
                    {user.nombre} {user.apellido}
                  </span>
                  <span className="user-role">
                    {user.rol === 'admin' ? '👑' : '👤'}
                  </span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-email">{user.email}</div>
                      <div className="user-role-badge">
                        {user.rol === 'admin' ? 'Administrador' : 'Cliente'}
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button 
                  className="login-btn"
                  onClick={() => setShowLogin(true)}
                >
                  🔐 Iniciar Sesión
                </button>
                <button 
                  className="register-btn"
                  onClick={() => setShowRegister(true)}
                >
                  📝 Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Modales de autenticación */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Login 
              onSwitchToRegister={() => {
                setShowLogin(false);
                setShowRegister(true);
              }}
              onClose={handleLoginSuccess}
            />
          </div>
        </div>
      )}

      {showRegister && (
        <div className="modal-overlay" onClick={() => setShowRegister(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Register 
              onSwitchToLogin={() => {
                setShowRegister(false);
                setShowLogin(true);
              }}
              onClose={handleRegisterSuccess}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
