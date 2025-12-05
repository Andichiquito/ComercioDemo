const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Ruta de carga de datos funcionando',
    timestamp: new Date().toISOString()
  });
});

// Configurar multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (allowed.includes(file.mimetype) || file.originalname.match(/\.(xlsx|xls)$/i)) {
      cb(null, true);
    } else {
      cb(new Error('Solo archivos Excel permitidos'), false);
    }
  }
});

// Columnas que DEBEN ser numéricas (double precision en la base de datos)
const NUMERIC_COLUMNS = [
  'codigo_de_la_aduana_de_despacho',
  'codigo_arancelario_nandina_norma_de_clasificacion_de_productos_',
  'descripcion_del_producto_segun_codigo_nandina',
  'codigo_del_pais_de_destino',
  'codigo_de_zona_geoeconomica',
  'codigo_de_la_via_de_salida_puerto_aeropuerto_frontera',
  'codigo_del_departamento_de_origen',
  'peso_bruto_kg',
  'peso_neto_kg',
  'contenido_fino_en_caso_de_minerales_u_otros_productos_que_requi',
  'valor_fob_en_dolares_estadounidenses'
];

// Normalizar nombres
const normalizeColumnName = (name) => {
  if (!name) return null;
  return String(name).trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
};

// Mapeo de columnas
const COLUMN_MAPPING = {
  'codigo_de_la_aduana_de_despacho': 'codigo_de_la_aduana_de_despacho',
  'descripcion_de_la_aduana_de_despacho': 'descripcion_de_la_aduana_de_despacho',
  'gestion': 'gestion',
  'mes': 'mes',
  'tipo_de_operacion_exportacion_reexportacion_o_efectos_personales': 'tipo_de_operacion_exportacion_reexportacion_o_efectos_personale',
  'codigo_arancelario_nandina_norma_de_clasificacion_de_productos_en_la_can': 'codigo_arancelario_nandina_norma_de_clasificacion_de_productos_',
  'descripcion_del_producto_segun_codigo_nandina': 'descripcion_del_producto_segun_codigo_nandina',
  'capitulo_de_la_clasificacion_nandina_primeros_2_digitos': 'capitulo_de_la_clasificacion_nandina_primeros_2_digitos',
  'descripcion_del_capitulo_nandina': 'descripcion_del_capitulo_nandina',
  'seccion_de_la_clasificacion_nandina': 'seccion_de_la_clasificacion_nandina',
  'descripcion_de_la_seccion_nandina': 'descripcion_de_la_seccion_nandina',
  'codigo_del_pais_de_destino': 'codigo_del_pais_de_destino',
  'nombre_del_pais_de_destino': 'nombre_del_pais_de_destino',
  'codigo_de_zona_geoeconomica': 'codigo_de_zona_geoeconomica',
  'descripcion_de_zona_geoeconomica_can_mercosur_nafta_etc': 'descripcion_de_zona_geoeconomica_can_mercosur_nafta_etc',
  'medi': 'medi',
  'descripcion_del_medio_de_transporte_aereo_terrestre_maritimo_etc': 'descripcion_del_medio_de_transporte_aereo_terrestre_maritimo_et',
  'codigo_de_la_via_de_salida_puerto_aeropuerto_frontera': 'codigo_de_la_via_de_salida_puerto_aeropuerto_frontera',
  'descripcion_de_la_via_de_salida': 'descripcion_de_la_via_de_salida',
  'codigo_del_departamento_de_origen': 'codigo_del_departamento_de_origen',
  'descripcion_del_departamento_de_origen': 'descripcion_del_departamento_de_origen',
  'cuci3': 'cuci3',
  'descuci3': 'descuci3',
  'gce3': 'gce3',
  'desgce3': 'desgce3',
  'ciiur3': 'ciiur3',
  'descripcion_de_la_clasificacion_ciiu_rev3': 'descripcion_de_la_clasificacion_ciiu_rev3',
  'clasificacion_por_actividad_economica_texto': 'clasificacion_por_actividad_economica_texto',
  'codact2': 'codact2',
  'descripcion_del_producto_segun_actividad_economica': 'descripcion_del_producto_segun_actividad_economica',
  'tnt': 'tnt',
  'destnt': 'destnt',
  'cltnt': 'cltnt',
  'peso_bruto_kg': 'peso_bruto_kg',
  'peso_neto_kg': 'peso_neto_kg',
  'contenido_fino_en_caso_de_minerales_u_otros_productos_que_requieran_pureza': 'contenido_fino_en_caso_de_minerales_u_otros_productos_que_requi',
  'valor_fob_en_dolares_estadounidenses': 'valor_fob_en_dolares_estadounidenses'
};

// Convertir valor
const convertValue = (value) => {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'number') return isNaN(value) ? null : value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Solo convertir si parece número
    const onlyNumberChars = /^[-+]?[\d\s,]*\.?\d+$/.test(trimmed);
    if (onlyNumberChars) {
      const cleaned = trimmed.replace(/[\s,]/g, '');
      const numValue = parseFloat(cleaned);
      if (!isNaN(numValue)) return numValue;
    }
    return trimmed;
  }
  return String(value);
};

// Validar que el valor sea numérico
const ensureNumeric = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number' && !isNaN(value)) return value;
  return null; // Si no es número, retornar null
};

// Ruta de carga
router.post('/upload', authenticateToken, requireAdmin, upload.single('excelFile'), async (req, res) => {
  console.log('\n📤 INICIANDO CARGA DE DATOS');

  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se proporciono archivo' });
    }

    console.log(`📄 Archivo: ${req.file.originalname}`);

    // Leer Excel
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null, raw: false });

    if (excelData.length === 0) {
      return res.status(400).json({ success: false, message: 'Archivo vacio' });
    }

    const excelHeaders = excelData[0];
    const dataRows = excelData.slice(1).filter(row => row.some(cell => cell !== null && cell !== undefined && cell !== ''));

    console.log(`📋 Headers: ${excelHeaders.length}, Filas: ${dataRows.length}`);

    if (dataRows.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay datos' });
    }

    // Mapear columnas
    console.log('\n🔍 Mapeando columnas...');
    const columnMap = {};
    const normalizedHeaders = excelHeaders.map(h => normalizeColumnName(h));

    normalizedHeaders.forEach((normalizedHeader, index) => {
      if (!normalizedHeader) return;
      const dbColumn = COLUMN_MAPPING[normalizedHeader];
      if (dbColumn) {
        columnMap[index] = dbColumn;
        console.log(`✅ "${excelHeaders[index]}" -> "${dbColumn}"`);
      }
    });

    console.log(`📊 Mapeadas: ${Object.keys(columnMap).length}`);

    if (Object.keys(columnMap).length === 0) {
      return res.status(400).json({ success: false, message: 'No se pudo mapear columnas' });
    }

    // Eliminar datos existentes
    console.log('\n🗑️ Eliminando datos...');
    const { error: deleteError } = await supabase.from('hoja1').delete().neq('id', 0);
    if (deleteError) throw deleteError;
    console.log('✅ Eliminados');

    // Preparar datos
    console.log('\n📝 Preparando datos...');
    const insertData = [];

    for (let i = 0; i < dataRows.length; i++) {
      const row = dataRows[i];
      const record = {};

      Object.keys(columnMap).forEach(excelIndex => {
        const dbColumn = columnMap[excelIndex];
        const value = row[parseInt(excelIndex)];
        let converted = convertValue(value);

        // Si la columna es numerica, asegurar que sea numero o null
        if (NUMERIC_COLUMNS.includes(dbColumn)) {
          converted = ensureNumeric(converted);
        }

        record[dbColumn] = converted;
      });

      insertData.push(record);

      if ((i + 1) % 1000 === 0) {
        console.log(`📝 ${i + 1} filas preparadas...`);
      }
    }

    console.log(`✅ ${insertData.length} registros preparados`);

    // Insertar en batches
    console.log('\n🚀 Insertando...');
    const BATCH_SIZE = 1000;
    let totalInserted = 0;

    for (let i = 0; i < insertData.length; i += BATCH_SIZE) {
      const batch = insertData.slice(i, i + BATCH_SIZE);
      const { error } = await supabase.from('hoja1').insert(batch);

      if (error) {
        console.error(`❌ Error batch ${i / BATCH_SIZE + 1}:`, error);
        throw error;
      }

      totalInserted += batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} (+${totalInserted})`);
    }

    // Verificar
    const { count } = await supabase.from('hoja1').select('*', { count: 'exact', head: true });

    console.log(`\n✅ COMPLETADO: ${count || totalInserted} registros`);

    res.json({
      success: true,
      message: 'Datos cargados exitosamente',
      data: {
        totalRows: dataRows.length,
        insertedRows: totalInserted,
        recordsInDB: count || totalInserted,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al cargar datos',
      error: error.message,
      details: error.details
    });
  }
});

// Estructura
router.get('/structure', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { data } = await supabase.from('hoja1').select('*').limit(1);
    const columns = data && data.length > 0 ? Object.keys(data[0]).map(col => ({ name: col })) : [];
    res.json({ success: true, table: 'hoja1', columns, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo estructura', error: error.message });
  }
});

module.exports = router;
