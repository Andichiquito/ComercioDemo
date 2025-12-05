const { query } = require('../config/database');

async function inspectUsers() {
  try {
    console.log('🔍 Inspeccionando tabla de usuarios...\n');
    
    // Obtener estructura de la tabla usuarios
    const structureQuery = `
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        character_maximum_length
      FROM information_schema.columns 
      WHERE table_name = 'usuarios' 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `;
    
    const structure = await query(structureQuery);
    console.log('📋 Estructura de la tabla usuarios:');
    console.table(structure.rows);
    
    // Obtener todos los usuarios
    const usersQuery = 'SELECT * FROM usuarios ORDER BY id';
    const users = await query(usersQuery);
    
    console.log('\n👥 Usuarios en la base de datos:');
    console.table(users.rows);
    
    // Contar por roles
    const countQuery = `
      SELECT 
        rol,
        COUNT(*) as cantidad
      FROM usuarios 
      GROUP BY rol
      ORDER BY rol
    `;
    
    const counts = await query(countQuery);
    console.log('\n📊 Distribución por roles:');
    console.table(counts.rows);
    
    // Mostrar usuarios activos
    const activeQuery = `
      SELECT 
        id,
        nombre,
        email,
        rol,
        activo,
        fecha_registro,
        ultimo_acceso
      FROM usuarios 
      WHERE activo = true
      ORDER BY ultimo_acceso DESC
    `;
    
    const activeUsers = await query(activeQuery);
    console.log('\n✅ Usuarios activos:');
    console.table(activeUsers.rows);
    
  } catch (error) {
    console.error('❌ Error inspeccionando usuarios:', error.message);
  } finally {
    process.exit(0);
  }
}

inspectUsers();
