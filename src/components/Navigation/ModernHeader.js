import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaChartBar, FaGlobe, FaClipboardList, FaChartLine, FaSearch, FaInfoCircle, FaUser, FaSignOutAlt, FaCog, FaUpload, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import Modal from '../UI/Modal';
import './ModernHeader.css';

const ModernHeader = () => {
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Aquí puedes agregar la lógica para cambiar el tema
  };

  const navItems = [
    {
      path: '/',
      icon: FaChartBar,
      label: 'Dashboard',
      sublabel: null
    },
    {
      path: '/panel-comercio',
      icon: FaGlobe,
      label: 'Panel',
      sublabel: 'Comercio'
    },
    {
      path: '/datos-comerciales',
      icon: FaClipboardList,
      label: 'Datos',
      sublabel: 'Comerciales'
    },
    {
      path: '/graficos',
      icon: FaChartLine,
      label: 'Gráficos',
      sublabel: 'Avanzados'
    },
    {
      path: '/analisis',
      icon: FaSearch,
      label: 'Análisis',
      sublabel: 'de'
    },

  ];

  return (
    <>
      <header className="modern-header">
        <div className="header-container">
          {/* Brand Section */}
          <div className="brand-section">
            <div className="brand-logo">
              <img
                src="/download.png"
                alt="Universidad del Valle"
                className="univalle-logo"
              />
            </div>
            <div className="brand-text">
              <span className="brand-name">Universidad del Valle</span>
              <span className="brand-subtitle">Global Trade Analytics</span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="nav-menu">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <div className="nav-icon">
                  <item.icon />
                </div>
                <div className="nav-text">
                  <div className="nav-label">{item.label}</div>
                  {item.sublabel && (
                    <div className="nav-sublabel">{item.sublabel}</div>
                  )}
                </div>
              </Link>
            ))}

            {/* Admin Link - Solo visible para administradores */}
            {user && isAdmin() && (
              <Link
                to="/admin"
                className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                <div className="nav-icon">
                  <FaCog />
                </div>
                <div className="nav-text">
                  <div className="nav-label">Admin</div>
                </div>
              </Link>
            )}
          </nav>

          {/* Actions Section */}
          <div className="actions-section">
            {/* Theme Toggle */}
            <div className="theme-toggle-container">
            
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="user-menu-container">
                <button
                  className="user-button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {user.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user.nombre}</div>
                    <div className="user-role">
                      {user.rol === 'admin' ? '👑' : '👤'}
                    </div>
                  </div>
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
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
              <div className="auth-buttons">
                <button
                  className="login-button"
                  onClick={() => setShowLogin(true)}
                >
                  <div className="button-icon">🔐</div>
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  className="register-button"
                  onClick={() => setShowRegister(true)}
                >
                  <div className="button-icon">📝</div>
                  <span>Registrar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modales de autenticación */}
      <Modal isOpen={showLogin} onClose={() => setShowLogin(false)}>
        <Login
          onSwitchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          onClose={handleLoginSuccess}
        />
      </Modal>

      <Modal isOpen={showRegister} onClose={() => setShowRegister(false)}>
        <Register
          onSwitchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          onClose={handleRegisterSuccess}
        />
      </Modal>
    </>
  );
};

export default ModernHeader;
