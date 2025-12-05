const { supabase, testConnection } = require('./supabase');

// Función para ejecutar consultas SQL raw (cuando sea necesario)
const query = async (text, params) => {
  const start = Date.now();
  try {
    // Para consultas SQL raw, usamos rpc o selects directos
    console.warn('⚠️ Uso de query SQL raw. Considera usar métodos de Supabase directamente.');

    // Esta es una función fallback, la mayoría de consultas deberían usar supabase directamente
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: text
    });

    if (error) throw error;

    const duration = Date.now() - start;
    console.log('📝 Query ejecutada:', { duration, rows: data?.length || 0 });

    return {
      rows: data || [],
      rowCount: data?.length || 0
    };
  } catch (error) {
    console.error('❌ Error en query:', error.message);
    throw error;
  }
};

// Función para obtener el cliente de Supabase
const getClient = () => {
  return supabase;
};

module.exports = {
  supabase,
  query,
  getClient,
  testConnection
};
