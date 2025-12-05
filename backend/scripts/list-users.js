const { supabase } = require('../config/database');

async function listAllUsers() {
    try {
        console.log('📋 Listando todos los usuarios...\n');

        const { data, error } = await supabase
            .from('usuarios')
            .select('id, email, nombre, apellido, rol, activo')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }

        if (data && data.length > 0) {
            console.log(`✅ Se encontraron ${data.length} usuarios:\n`);
            console.table(data);
        } else {
            console.log('⚠️ No hay usuarios en la base de datos');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

listAllUsers();
