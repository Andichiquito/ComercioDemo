#!/usr/bin/env node

const { testConnection } = require('../config/database');
const app = require('../server');

// Función para verificar que PostgreSQL esté ejecutándose
const checkPostgreSQL = async () => {
  console.log('🔍 Verificando conexión a PostgreSQL...');
  
  const isConnected = await testConnection();
  
  if (!isConnected) {
    console.log('\n❌ No se pudo conectar a PostgreSQL');
    console.log('🔧 Soluciones posibles:');
    console.log('   1. Verifica que PostgreSQL esté ejecutándose');
    console.log('   2. Revisa las credenciales en el archivo .env');
    console.log('   3. Asegúrate de que la base de datos "Comercio" exista');
    console.log('   4. Verifica que el puerto 5432 esté disponible');
    console.log('\n💡 Para iniciar PostgreSQL en Windows:');
    console.log('   - Busca "Services" en el menú inicio');
    console.log('   - Encuentra "postgresql-x64-XX" y haz clic en "Start"');
    console.log('   - O ejecuta: net start postgresql-x64-XX');
    
    process.exit(1);
  }
  
  console.log('✅ PostgreSQL está funcionando correctamente\n');
};

// Función principal
const startServer = async () => {
  try {
    await checkPostgreSQL();
    
    const PORT = process.env.PORT || 5000;
    
    app.listen(PORT, () => {
      console.log('🚀 Servidor iniciado exitosamente!');
      console.log(`📡 Backend: http://localhost:${PORT}`);
      console.log('🔗 Frontend: http://localhost:3000');
      console.log('📊 Base de datos: PostgreSQL - Comercio');
      console.log('\n🎉 ¡Todo listo para trabajar!');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando servidor...');
  process.exit(0);
});

// Iniciar el servidor
startServer();
