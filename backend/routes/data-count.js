const express = require('express');
const { supabase } = require('../config/database');
const router = express.Router();

// Ruta para contar registros en la tabla hoja1
router.get('/hoja1', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('hoja1')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.json({
      success: true,
      tabla: 'hoja1',
      total_registros: count || 0,
      mensaje: `La tabla hoja1 tiene ${count || 0} registros`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error contando registros en hoja1:', error);
    res.status(500).json({
      success: false,
      tabla: 'hoja1',
      mensaje: 'Error contando registros en hoja1',
      error: error.message
    });
  }
});

// Ruta para contar registros en la tabla usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('usuarios')
      .select('*', { count: 'exact', head: true });

    if (error) throw error;

    res.json({
      success: true,
      tabla: 'usuarios',
      total_registros: count || 0,
      mensaje: `La tabla usuarios tiene ${count || 0} registros`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error contando registros en usuarios:', error);
    res.status(500).json({
      success: false,
      tabla: 'usuarios',
      mensaje: 'Error contando registros en usuarios',
      error: error.message
    });
  }
});

// Ruta para contar registros en ambas tablas
router.get('/ambas', async (req, res) => {
  try {
    const [hoja1Result, usuariosResult] = await Promise.all([
      supabase.from('hoja1').select('*', { count: 'exact', head: true }),
      supabase.from('usuarios').select('*', { count: 'exact', head: true })
    ]);

    if (hoja1Result.error) throw hoja1Result.error;
    if (usuariosResult.error) throw usuariosResult.error;

    const totalHoja1 = hoja1Result.count || 0;
    const totalUsuarios = usuariosResult.count || 0;

    res.json({
      success: true,
      tablas: {
        hoja1: {
          total_registros: totalHoja1,
          mensaje: `La tabla hoja1 tiene ${totalHoja1} registros`
        },
        usuarios: {
          total_registros: totalUsuarios,
          mensaje: `La tabla usuarios tiene ${totalUsuarios} registros`
        }
      },
      resumen: {
        total_general: totalHoja1 + totalUsuarios,
        mensaje: `En total hay ${totalHoja1 + totalUsuarios} registros entre ambas tablas`
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error contando registros en ambas tablas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error contando registros en las tablas',
      error: error.message
    });
  }
});

// Ruta para obtener información detallada de las tablas
router.get('/info', async (req, res) => {
  try {
    const resultados = {};
    const tablas = ['hoja1', 'usuarios'];

    // Contar registros en cada tabla
    for (const tabla of tablas) {
      try {
        const { count, error } = await supabase
          .from(tabla)
          .select('*', { count: 'exact', head: true });

        if (error) {
          resultados[tabla] = {
            existe: false,
            error: error.message
          };
        } else {
          resultados[tabla] = {
            existe: true,
            total_registros: count || 0
          };
        }
      } catch (error) {
        resultados[tabla] = {
          existe: false,
          error: error.message
        };
      }
    }

    const tablasEncontradas = Object.keys(resultados).filter(
      tabla => resultados[tabla].existe
    );

    res.json({
      success: true,
      tablas_encontradas: tablasEncontradas,
      resultados,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo información de tablas:', error);
    res.status(500).json({
      success: false,
      mensaje: 'Error obteniendo información de las tablas',
      error: error.message
    });
  }
});

module.exports = router;
