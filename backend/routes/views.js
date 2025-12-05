const express = require('express');
const { supabase } = require('../config/database');
const router = express.Router();

// Ruta para obtener una muestra de datos de cada tabla
router.get('/sample-data', async (req, res) => {
  try {
    const [hoja1Result, usuariosResult] = await Promise.all([
      supabase.from('hoja1').select('*').limit(5),
      supabase.from('usuarios').select('*').limit(5)
    ]);

    if (hoja1Result.error) throw hoja1Result.error;
    if (usuariosResult.error) throw usuariosResult.error;

    res.json({
      success: true,
      muestras: {
        hoja1: {
          datos: hoja1Result.data,
          total_registros: hoja1Result.data.length
        },
        usuarios: {
          datos: usuariosResult.data,
          total_registros: usuariosResult.data.length
        }
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo muestra de datos:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error obteniendo muestra de datos',
      error: error.message
    });
  }
});

// Ruta para consultar una vista específica
router.get('/query/:nombreVista', async (req, res) => {
  try {
    const { nombreVista } = req.params;
    const { limit = 100, offset = 0 } = req.query;

    const { data, error, count } = await supabase
      .from(nombreVista)
      .select('*', { count: 'exact' })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json({
      success: true,
      vista: nombreVista,
      datos: data,
      total_registros: data.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error consultando vista ${req.params.nombreVista}:`, error);
    res.status(500).json({
      success: false,
      mensaje: `Error consultando vista ${req.params.nombreVista}`,
      error: error.message
    });
  }
});

module.exports = router;
