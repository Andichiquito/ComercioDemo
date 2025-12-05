/**
 * Script para crear vistas útiles en la base de datos PostgreSQL
 * Basado en los datos de comercio internacional de la tabla hoja1
 */

const { query } = require('../config/database');

// Definición de vistas a crear
const vistas = [
  {
    nombre: 'vista_exportaciones_por_pais',
    descripcion: 'Resumen de exportaciones agrupadas por país de destino',
    consulta: `
      SELECT 
        nombre_del_pais_de_destino,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        SUM(peso_neto_kg) as peso_total_kg,
        COUNT(DISTINCT descripcion_del_producto_segun_codigo_nandina) as productos_unicos
      FROM hoja1 
      WHERE tipo_de_operacion_exportacion_reexportacion_o_efectos_personale LIKE '%EXPORTACION%'
      GROUP BY nombre_del_pais_de_destino
      ORDER BY valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_operaciones_por_mes',
    descripcion: 'Operaciones comerciales agrupadas por mes y año',
    consulta: `
      SELECT 
        gestion as año,
        mes,
        tipo_de_operacion_exportacion_reexportacion_o_efectos_personale as tipo_operacion,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        SUM(peso_neto_kg) as peso_total_kg
      FROM hoja1 
      GROUP BY gestion, mes, tipo_de_operacion_exportacion_reexportacion_o_efectos_personale
      ORDER BY gestion DESC, mes DESC, valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_aduana_despacho',
    descripcion: 'Estadísticas por aduana de despacho',
    consulta: `
      SELECT 
        codigo_de_la_aduana_de_despacho,
        descripcion_de_la_aduana_de_despacho,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        COUNT(DISTINCT nombre_del_pais_de_destino) as paises_destino,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd
      FROM hoja1 
      GROUP BY codigo_de_la_aduana_de_despacho, descripcion_de_la_aduana_de_despacho
      ORDER BY valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_productos_mas_exportados',
    descripcion: 'Productos más exportados con estadísticas',
    consulta: `
      SELECT 
        descripcion_del_producto_segun_codigo_nandina as codigo_producto,
        descripcion_del_capitulo_nandina as descripcion_capitulo,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        SUM(peso_neto_kg) as peso_total_kg,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        COUNT(DISTINCT nombre_del_pais_de_destino) as paises_destino
      FROM hoja1 
      WHERE tipo_de_operacion_exportacion_reexportacion_o_efectos_personale LIKE '%EXPORTACION%'
      GROUP BY descripcion_del_producto_segun_codigo_nandina, descripcion_del_capitulo_nandina
      ORDER BY valor_total_usd DESC
      LIMIT 50
    `
  },
  {
    nombre: 'vista_operaciones_recientes',
    descripcion: 'Operaciones más recientes con información detallada',
    consulta: `
      SELECT 
        id,
        created_at,
        gestion,
        mes,
        tipo_de_operacion_exportacion_reexportacion_o_efectos_personale as tipo_operacion,
        nombre_del_pais_de_destino,
        descripcion_del_producto_segun_codigo_nandina as codigo_producto,
        valor_fob_en_dolares_estadounidenses,
        peso_neto_kg,
        descripcion_de_la_aduana_de_despacho,
        descripcion_del_medio_de_transporte_aereo_terrestre_maritimo_et as medio_transporte
      FROM hoja1 
      WHERE created_at IS NOT NULL
      ORDER BY created_at DESC
      LIMIT 1000
    `
  },
  {
    nombre: 'vista_estadisticas_generales',
    descripcion: 'Estadísticas generales del comercio',
    consulta: `
      SELECT 
        tipo_de_operacion_exportacion_reexportacion_o_efectos_personale as tipo_operacion,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        SUM(peso_neto_kg) as peso_total_kg,
        COUNT(DISTINCT nombre_del_pais_de_destino) as paises_destino,
        COUNT(DISTINCT descripcion_del_producto_segun_codigo_nandina) as productos_unicos,
        COUNT(DISTINCT descripcion_de_la_aduana_de_despacho) as aduanas_unicas
      FROM hoja1 
      GROUP BY tipo_de_operacion_exportacion_reexportacion_o_efectos_personale
      ORDER BY valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_top_10_paises_exportacion',
    descripcion: 'Top 10 países de destino para exportaciones',
    consulta: `
      SELECT 
        nombre_del_pais_de_destino,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        ROUND((SUM(valor_fob_en_dolares_estadounidenses) * 100.0 / 
          (SELECT SUM(valor_fob_en_dolares_estadounidenses) FROM hoja1 
           WHERE tipo_de_operacion_exportacion_reexportacion_o_efectos_personale LIKE '%EXPORTACION%')), 2) as porcentaje_del_total
      FROM hoja1 
      WHERE tipo_de_operacion_exportacion_reexportacion_o_efectos_personale LIKE '%EXPORTACION%'
      GROUP BY nombre_del_pais_de_destino
      ORDER BY valor_total_usd DESC
      LIMIT 10
    `
  },
  {
    nombre: 'vista_medio_transporte',
    descripcion: 'Estadísticas por medio de transporte',
    consulta: `
      SELECT 
        descripcion_del_medio_de_transporte_aereo_terrestre_maritimo_et as medio_transporte,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        SUM(peso_neto_kg) as peso_total_kg,
        COUNT(DISTINCT nombre_del_pais_de_destino) as paises_destino
      FROM hoja1 
      GROUP BY descripcion_del_medio_de_transporte_aereo_terrestre_maritimo_et
      ORDER BY valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_departamentos_origen',
    descripcion: 'Estadísticas por departamento de origen',
    consulta: `
      SELECT 
        descripcion_del_departamento_de_origen as departamento,
        COUNT(*) as total_operaciones,
        SUM(valor_fob_en_dolares_estadounidenses) as valor_total_usd,
        AVG(valor_fob_en_dolares_estadounidenses) as valor_promedio_usd,
        SUM(peso_neto_kg) as peso_total_kg,
        COUNT(DISTINCT nombre_del_pais_de_destino) as paises_destino
      FROM hoja1 
      GROUP BY descripcion_del_departamento_de_origen
      ORDER BY valor_total_usd DESC
    `
  },
  {
    nombre: 'vista_usuarios_activos',
    descripcion: 'Información de usuarios del sistema',
    consulta: `
      SELECT 
        id,
        nombre,
        apellido,
        email,
        rol,
        activo,
        fecha_registro,
        ultimo_acceso,
        CASE 
          WHEN ultimo_acceso IS NOT NULL THEN 'Activo'
          ELSE 'Inactivo'
        END as estado
      FROM usuarios
      ORDER BY fecha_registro DESC
    `
  }
];

// Función para crear todas las vistas
async function crearTodasLasVistas() {
  console.log('🚀 Iniciando creación de vistas...\n');
  
  for (const vista of vistas) {
    try {
      console.log(`📊 Creando vista: ${vista.nombre}`);
      console.log(`📝 Descripción: ${vista.descripcion}`);
      
      const createViewQuery = `CREATE OR REPLACE VIEW ${vista.nombre} AS ${vista.consulta}`;
      await query(createViewQuery);
      
      console.log(`✅ Vista "${vista.nombre}" creada exitosamente\n`);
    } catch (error) {
      console.error(`❌ Error creando vista "${vista.nombre}":`, error.message);
      console.log('');
    }
  }
  
  console.log('🎉 Proceso de creación de vistas completado');
}

// Función para listar todas las vistas creadas
async function listarVistas() {
  try {
    console.log('📋 Listando todas las vistas creadas...\n');
    
    const result = await query(`
      SELECT 
        viewname as nombre_vista,
        LENGTH(definition) as tamaño_definicion
      FROM pg_views 
      WHERE schemaname = 'public'
      AND viewname LIKE 'vista_%'
      ORDER BY viewname
    `);
    
    console.log('📊 Vistas encontradas:');
    result.rows.forEach((vista, index) => {
      console.log(`${index + 1}. ${vista.nombre_vista} (${vista.tamaño_definicion} caracteres)`);
    });
    
    console.log(`\n✅ Total de vistas: ${result.rowCount}`);
  } catch (error) {
    console.error('❌ Error listando vistas:', error.message);
  }
}

// Función para probar una vista específica
async function probarVista(nombreVista, limite = 5) {
  try {
    console.log(`🔍 Probando vista: ${nombreVista}\n`);
    
    const result = await query(`SELECT * FROM ${nombreVista} LIMIT $1`, [limite]);
    
    console.log(`📊 Resultados (${result.rowCount} registros):`);
    console.log(JSON.stringify(result.rows, null, 2));
    console.log('');
  } catch (error) {
    console.error(`❌ Error probando vista "${nombreVista}":`, error.message);
  }
}

// Función principal
async function main() {
  try {
    // Crear todas las vistas
    await crearTodasLasVistas();
    
    // Listar vistas creadas
    await listarVistas();
    
    // Probar algunas vistas
    console.log('\n🧪 Probando algunas vistas...\n');
    await probarVista('vista_estadisticas_generales');
    await probarVista('vista_top_10_paises_exportacion');
    await probarVista('vista_usuarios_activos');
    
  } catch (error) {
    console.error('❌ Error en proceso principal:', error.message);
  }
}

// Exportar funciones para uso en otros archivos
module.exports = {
  crearTodasLasVistas,
  listarVistas,
  probarVista,
  vistas
};

// Si se ejecuta directamente, ejecutar función principal
if (require.main === module) {
  main();
}
