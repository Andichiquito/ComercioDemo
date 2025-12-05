import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Aplicar tema al documento
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Guardar preferencia
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-white/20 rounded-full p-1 transition-all duration-300 hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Toggle theme"
    >
      <div
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      >
        <div className="w-full h-full flex items-center justify-center">
          {isDark ? (
            <span className="text-xs">🌙</span>
          ) : (
            <span className="text-xs">☀️</span>
          )}
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;
