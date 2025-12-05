/**
 * Ejemplos de uso de la conexión a PostgreSQL
 * Este archivo muestra diferentes formas de interactuar con la base de datos
 */

const { query, getClient } = require('../config/database');
const { tableExists, getTableInfo, getAllTables } = require('../utils/dbUtils');

// Ejemplo 1: Consulta simple
async function ejemploConsultaSimple() {
  try {
    const result = await query('SELECT NOW() as fecha_actual, version() as version_postgres');
    console.log('📅 Fecha actual:', result.rows[0].fecha_actual);
    console.log('🐘 Versión PostgreSQL:', result.rows[0].version_postgres);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en consulta simple:', error.message);
    throw error;
  }
}

// Ejemplo 2: Consulta con parámetros
async function ejemploConsultaConParametros() {
  try {
    const nombre = 'Ejemplo';
    const email = 'ejemplo@test.com';
    
    const result = await query(
      'SELECT $1 as nombre, $2 as email, NOW() as timestamp',
      [nombre, email]
    );
    
    console.log('👤 Resultado:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Error en consulta con parámetros:', error.message);
    throw error;
  }
}

// Ejemplo 3: Crear tabla
async function ejemploCrearTabla() {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INTEGER DEFAULT 0,
        categoria VARCHAR(50),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        activo BOOLEAN DEFAULT true
      )
    `;
    
    await query(createTableQuery);
    console.log('✅ Tabla "productos" creada exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error creando tabla:', error.message);
    throw error;
  }
}

// Ejemplo 4: Insertar datos
async function ejemploInsertarDatos() {
  try {
    const productos = [
      ['Laptop Dell', 1200.00, 10, 'Electrónicos'],
      ['Mouse Inalámbrico', 25.50, 50, 'Accesorios'],
      ['Teclado Mecánico', 89.99, 25, 'Accesorios']
    ];
    
    for (const producto of productos) {
      await query(
        'INSERT INTO productos (nombre, precio, stock, categoria) VALUES ($1, $2, $3, $4)',
        producto
      );
    }
    
    console.log('✅ Productos insertados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error insertando datos:', error.message);
    throw error;
  }
}

// Ejemplo 5: Consultar datos
async function ejemploConsultarDatos() {
  try {
    // Obtener todos los productos
    const todosProductos = await query('SELECT * FROM productos ORDER BY fecha_creacion DESC');
    console.log('📦 Todos los productos:', todosProductos.rows);
    
    // Obtener productos por categoría
    const productosElectronica = await query(
      'SELECT * FROM productos WHERE categoria = $1',
      ['Electrónicos']
    );
    console.log('💻 Productos de electrónicos:', productosElectronica.rows);
    
    // Obtener estadísticas
    const estadisticas = await query(`
      SELECT 
        COUNT(*) as total_productos,
        AVG(precio) as precio_promedio,
        SUM(stock) as stock_total
      FROM productos 
      WHERE activo = true
    `);
    console.log('📊 Estadísticas:', estadisticas.rows[0]);
    
    return {
      todos: todosProductos.rows,
      electronica: productosElectronica.rows,
      estadisticas: estadisticas.rows[0]
    };
  } catch (error) {
    console.error('❌ Error consultando datos:', error.message);
    throw error;
  }
}

// Ejemplo 6: Transacción
async function ejemploTransaccion() {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    // Insertar un nuevo producto
    const insertResult = await client.query(
      'INSERT INTO productos (nombre, precio, stock, categoria) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Monitor 24"', 299.99, 15, 'Electrónicos']
    );
    
    const productoId = insertResult.rows[0].id;
    console.log('🆕 Producto creado con ID:', productoId);
    
    // Actualizar el stock
    await client.query(
      'UPDATE productos SET stock = stock - $1 WHERE id = $2',
      [5, productoId]
    );
    
    console.log('📉 Stock actualizado');
    
    await client.query('COMMIT');
    console.log('✅ Transacción completada exitosamente');
    
    return productoId;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error en transacción, rollback ejecutado:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Ejemplo 7: Usar utilidades
async function ejemploUtilidades() {
  try {
    // Verificar si existe la tabla
    const existeTabla = await tableExists('productos');
    console.log('🔍 ¿Existe tabla productos?', existeTabla);
    
    if (existeTabla) {
      // Obtener información de la tabla
      const infoTabla = await getTableInfo('productos');
      console.log('📋 Información de la tabla productos:', infoTabla);
    }
    
    // Obtener todas las tablas
    const todasTablas = await getAllTables();
    console.log('📚 Todas las tablas:', todasTablas);
    
    return {
      existeTabla,
      infoTabla: existeTabla ? await getTableInfo('productos') : null,
      todasTablas
    };
  } catch (error) {
    console.error('❌ Error usando utilidades:', error.message);
    throw error;
  }
}

// Función para ejecutar todos los ejemplos
async function ejecutarTodosLosEjemplos() {
  console.log('🚀 Iniciando ejemplos de base de datos...\n');
  
  try {
    await ejemploConsultaSimple();
    console.log('');
    
    await ejemploConsultaConParametros();
    console.log('');
    
    await ejemploCrearTabla();
    console.log('');
    
    await ejemploInsertarDatos();
    console.log('');
    
    await ejemploConsultarDatos();
    console.log('');
    
    await ejemploTransaccion();
    console.log('');
    
    await ejemploUtilidades();
    console.log('');
    
    console.log('✅ Todos los ejemplos ejecutados exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando ejemplos:', error.message);
  }
}

// Exportar funciones para uso en otros archivos
module.exports = {
  ejemploConsultaSimple,
  ejemploConsultaConParametros,
  ejemploCrearTabla,
  ejemploInsertarDatos,
  ejemploConsultarDatos,
  ejemploTransaccion,
  ejemploUtilidades,
  ejecutarTodosLosEjemplos
};

// Si se ejecuta directamente, correr todos los ejemplos
if (require.main === module) {
  ejecutarTodosLosEjemplos();
}
