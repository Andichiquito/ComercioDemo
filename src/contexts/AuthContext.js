import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, message: error.message };
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error inesperado al iniciar sesión'
      };
    }
  };

  const register = async (userData) => {
    try {
      // Assuming userData contains email and password, and potential extra metadata
      const { email, password, ...rest } = userData;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: rest // Store other fields like name, role as user_metadata
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        return { success: true, user: data.user };
      }

      return { success: false, message: "No se pudo registrar el usuario" };

    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error inesperado al registrarse'
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error en logout:', error);
    }
  };

  // Helper functions to check roles based on user_metadata
  // Adjust key names based on how you save them in 'register' or Supabase
  const isAdmin = () => {
    return user?.user_metadata?.rol === 'admin';
  };

  const isClient = () => {
    return user?.user_metadata?.rol === 'cliente';
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const hasRole = (role) => {
    return user?.user_metadata?.rol === role;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isClient,
    isAuthenticated,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

