const { query } = require('../config/database');

/**
 * Utilidades para operaciones comunes con la base de datos
 */

// Función para verificar si una tabla existe
const tableExists = async (tableName) => {
  try {
    const result = await query(
      `SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )`,
      [tableName]
    );
    return result.rows[0].exists;
  } catch (error) {
    console.error('Error verificando existencia de tabla:', error);
    return false;
  }
};

// Función para obtener información de las tablas
const getTableInfo = async (tableName) => {
  try {
    const result = await query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND table_schema = 'public'
      ORDER BY ordinal_position
    `, [tableName]);
    
    return result.rows;
  } catch (error) {
    console.error('Error obteniendo información de tabla:', error);
    throw error;
  }
};

// Función para obtener todas las tablas de la base de datos
const getAllTables = async () => {
  try {
    const result = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('Error obteniendo tablas:', error);
    throw error;
  }
};

// Función para ejecutar una transacción
const executeTransaction = async (operations) => {
  const client = await getClient();
  try {
    await client.query('BEGIN');
    
    const results = [];
    for (const operation of operations) {
      const result = await client.query(operation.query, operation.params || []);
      results.push(result);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Función para hacer backup de una tabla (solo estructura)
const backupTableStructure = async (tableName) => {
  try {
    const result = await query(`
      SELECT 
        'CREATE TABLE ' || table_name || ' (' ||
        string_agg(
          column_name || ' ' || data_type ||
          CASE 
            WHEN is_nullable = 'NO' THEN ' NOT NULL'
            ELSE ''
          END ||
          CASE 
            WHEN column_default IS NOT NULL THEN ' DEFAULT ' || column_default
            ELSE ''
          END,
          ', '
        ) || ');' as create_statement
      FROM information_schema.columns 
      WHERE table_name = $1 
      AND table_schema = 'public'
      GROUP BY table_name
    `, [tableName]);
    
    return result.rows[0]?.create_statement || null;
  } catch (error) {
    console.error('Error creando backup de estructura:', error);
    throw error;
  }
};

module.exports = {
  tableExists,
  getTableInfo,
  getAllTables,
  executeTransaction,
  backupTableStructure
};
