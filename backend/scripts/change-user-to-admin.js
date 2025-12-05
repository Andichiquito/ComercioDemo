const { supabase } = require('../config/database');

async function changeUserToAdmin(email) {
    try {
        console.log(`🔄 Cambiando rol de ${email} a admin...`);

        const { data, error } = await supabase
            .from('usuarios')
            .update({
                rol: 'admin',
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select('id, email, nombre, apellido, rol');

        if (error) {
            console.error('❌ Error:', error.message);
            process.exit(1);
        }

        if (data && data.length > 0) {
            console.log('✅ Usuario actualizado exitosamente:');
            console.table(data);
        } else {
            console.log('⚠️ No se encontró ningún usuario con ese email');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

// Cambiar este email por el que necesites
const emailToChange = 'andiguzman012@gmail.com';
changeUserToAdmin(emailToChange);
