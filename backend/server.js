const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // URLs del frontend React
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Servidor backend funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'Supabase (PostgreSQL)'
  });
});

// Ruta para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({
        success: true,
        message: '✅ Conexión a la base de datos exitosa',
        database: 'Comercio',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(500).json({
        success: false,
        message: '❌ Error conectando a la base de datos'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Error del servidor',
      error: error.message
    });
  }
});

// Ruta de ejemplo para obtener datos
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Importar y usar rutas de ejemplo
const exampleRoutes = require('./routes/example');
app.use('/api/example', exampleRoutes);

// Importar y usar rutas para contar datos
const dataCountRoutes = require('./routes/data-count');
app.use('/api/count', dataCountRoutes);

// Importar y usar rutas para vistas
const viewsRoutes = require('./routes/views');
app.use('/api/views', viewsRoutes);

// Importar y usar rutas de autenticación
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Importar y usar rutas de usuarios (CRUD para admins)
const usersRoutes = require('./routes/users');
app.use('/api/users', usersRoutes);

// Importar y usar rutas para carga de datos
const dataUploadRoutes = require('./routes/data-upload');
app.use('/api/data', dataUploadRoutes);
console.log('✅ Ruta de carga de datos registrada: /api/data');
console.log('   - POST /api/data/upload - Cargar datos desde Excel');
console.log('   - GET /api/data/test - Probar ruta');

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🚀 Servidor iniciado en puerto', PORT);
  console.log('📡 URL:', `http://localhost:${PORT}`);
  console.log('🔗 Frontend:', 'http://localhost:3000');

  // Probar conexión a la base de datos al iniciar
  testConnection();
});

module.exports = app;
