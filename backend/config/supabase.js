const { createClient } = require('@supabase/supabase-js');
const config = require('./config');

// Crear cliente de Supabase
const supabase = createClient(
    config.supabase.url,
    config.supabase.anonKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        }
    }
);

// Función para probar la conexión
const testConnection = async () => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('count')
            .limit(1);

        if (error) throw error;

        console.log('✅ Conexión a Supabase exitosa');
        console.log('🚀 Proyecto:', config.supabase.url);
        console.log('📊 Base de datos: PostgreSQL (Supabase)');
        return true;
    } catch (error) {
        console.error('❌ Error conectando a Supabase:', error.message);
        console.error('🔧 Verifica que las credenciales sean correctas');
        return false;
    }
};

module.exports = {
    supabase,
    testConnection
};
