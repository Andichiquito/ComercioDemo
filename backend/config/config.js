require('dotenv').config();

// Configuración centralizada de la aplicación
module.exports = {
  // Configuración de Supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
  },

  // Configuración del servidor
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost'
  },

  // Configuración de CORS
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_aqui',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración de desarrollo
  development: {
    logQueries: process.env.NODE_ENV !== 'production',
    logErrors: process.env.NODE_ENV !== 'production'
  }
};
