const express = require('express');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Aplicar autenticación y autorización de admin a todas las rutas
router.use(authenticateToken);
router.use(requireAdmin);

// Obtener todos los usuarios (con paginación)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    let query = supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, rol, activo, fecha_registro, ultimo_acceso, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (search) {
      query = query.or(`nombre.ilike.%${search}%,apellido.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) throw error;

    res.json({
      success: true,
      data: {
        users: users || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          pages: Math.ceil((count || 0) / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: user, error } = await supabase
      .from('usuarios')
      .select('id, email, nombre, apellido, rol, activo, fecha_registro, ultimo_acceso, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error || !user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { email, password, nombre, apellido, rol = 'cliente' } = req.body;

    // Validaciones
    if (!email || !password || !nombre || !apellido) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Validar que el email sea solo de Gmail o Hotmail
    const domain = email.toLowerCase().split('@')[1];
    const allowedDomains = ['gmail.com', 'hotmail.com', 'hotmail.es', 'hotmail.com.ar', 'hotmail.com.mx'];
    if (!allowedDomains.includes(domain)) {
      return res.status(400).json({
        success: false,
        message: 'Solo se permiten emails de Gmail o Hotmail'
      });
    }

    if (!['admin', 'cliente'].includes(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido. Debe ser "admin" o "cliente"'
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    if (password.length > 12) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener máximo 12 caracteres'
      });
    }

    // Validar que tenga al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe contener al menos una mayúscula'
      });
    }

    // Validar que tenga al menos un símbolo especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe contener al menos un símbolo especial'
      });
    }

    // Verificar si el email ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insertar nuevo usuario
    const { data: newUser, error: insertError } = await supabase
      .from('usuarios')
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        nombre,
        apellido,
        rol,
        activo: true,
        fecha_registro: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('id, email, nombre, apellido, rol, activo, fecha_registro')
      .single();

    if (insertError) throw insertError;

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.error('Error creando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { email, nombre, apellido, rol, activo, password } = req.body;

    // Verificar que el usuario existe
    const { data: existingUser, error: findError } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', id)
      .single();

    if (findError || !existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Construir objeto de actualización dinámicamente
    const updateData = {};

    if (email !== undefined) {
      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'El formato del email no es válido'
        });
      }

      // Validar que el email sea solo de Gmail o Hotmail
      const domain = email.toLowerCase().split('@')[1];
      const allowedDomains = ['gmail.com', 'hotmail.com', 'hotmail.es', 'hotmail.com.ar', 'hotmail.com.mx'];
      if (!allowedDomains.includes(domain)) {
        return res.status(400).json({
          success: false,
          message: 'Solo se permiten emails de Gmail o Hotmail'
        });
      }

      // Verificar si el email ya existe en otro usuario
      const { data: emailCheck, error: emailError } = await supabase
        .from('usuarios')
        .select('id')
        .eq('email', email.toLowerCase())
        .neq('id', id)
        .single();

      if (emailCheck) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }

      updateData.email = email.toLowerCase();
    }

    if (nombre !== undefined) {
      updateData.nombre = nombre;
    }

    if (apellido !== undefined) {
      updateData.apellido = apellido;
    }

    if (rol !== undefined) {
      if (!['admin', 'cliente'].includes(rol)) {
        return res.status(400).json({
          success: false,
          message: 'Rol inválido. Debe ser "admin" o "cliente"'
        });
      }
      updateData.rol = rol;
    }

    if (activo !== undefined) {
      updateData.activo = activo;
    }

    if (password !== undefined && password.trim() !== '') {
      // Validar longitud de contraseña
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener al menos 6 caracteres'
        });
      }

      if (password.length > 12) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe tener máximo 12 caracteres'
        });
      }

      // Validar que tenga al menos una mayúscula
      if (!/[A-Z]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe contener al menos una mayúscula'
        });
      }

      // Validar que tenga al menos un símbolo especial
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña debe contener al menos un símbolo especial'
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      updateData.password_hash = passwordHash;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    // Agregar updated_at
    updateData.updated_at = new Date().toISOString();

    const { data: updatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update(updateData)
      .eq('id', id)
      .select('id, email, nombre, apellido, rol, activo, fecha_registro, ultimo_acceso, updated_at')
      .single();

    if (updateError) throw updateError;

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: {
        user: updatedUser
      }
    });

  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Eliminar usuario (soft delete - desactivar)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el usuario existe
    const { data: existingUser, error: findError } = await supabase
      .from('usuarios')
      .select('id, email')
      .eq('id', id)
      .single();

    if (findError || !existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir que un admin se elimine a sí mismo
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta'
      });
    }

    // Eliminar usuario completamente (hard delete)
    const { error: deleteError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: 'Usuario eliminado permanentemente'
    });

  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Reactivar usuario
router.patch('/:id/reactivate', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: reactivatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update({
        activo: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('id, email, nombre, apellido, rol, activo')
      .single();

    if (updateError || !reactivatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Usuario reactivado exitosamente',
      data: {
        user: reactivatedUser
      }
    });

  } catch (error) {
    console.error('Error reactivando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;
