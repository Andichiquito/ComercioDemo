const express = require('express');
const { query } = require('../config/database');
const router = express.Router();

// Ruta de ejemplo para obtener datos de la base de datos
router.get('/users', async (req, res) => {
  try {
    // Ejemplo de consulta - ajusta según tu esquema de base de datos
    const result = await query('SELECT NOW() as current_time, version() as postgres_version');
    
    res.json({
      success: true,
      message: 'Consulta exitosa',
      data: result.rows,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error en /api/example/users:', error);
    res.status(500).json({
      success: false,
      message: 'Error ejecutando consulta',
      error: error.message
    });
  }
});

// Ruta para crear una tabla de ejemplo (solo para testing)
router.post('/create-table', async (req, res) => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await query(createTableQuery);
    
    res.json({
      success: true,
      message: 'Tabla de prueba creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando tabla:', error);
    res.status(500).json({
      success: false,
      message: 'Error creando tabla',
      error: error.message
    });
  }
});

// Ruta para insertar datos de ejemplo
router.post('/insert-data', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y email son requeridos'
      });
    }
    
    const insertQuery = `
      INSERT INTO test_table (name, email) 
      VALUES ($1, $2) 
      RETURNING *
    `;
    
    const result = await query(insertQuery, [name, email]);
    
    res.json({
      success: true,
      message: 'Datos insertados exitosamente',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error insertando datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error insertando datos',
      error: error.message
    });
  }
});

// Ruta para obtener todos los datos de la tabla de prueba
router.get('/data', async (req, res) => {
  try {
    const result = await query('SELECT * FROM test_table ORDER BY created_at DESC');
    
    res.json({
      success: true,
      message: 'Datos obtenidos exitosamente',
      data: result.rows,
      count: result.rowCount
    });
  } catch (error) {
    console.error('Error obteniendo datos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo datos',
      error: error.message
    });
  }
});

module.exports = router;
