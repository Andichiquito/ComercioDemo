import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../UI/Toast';
import { FaUser, FaCheckCircle, FaTimesCircle, FaChartBar, FaCrown, FaEdit, FaTrash, FaExclamationTriangle, FaUpload, FaFileExcel } from 'react-icons/fa';
import Modal, { ConfirmModal } from '../UI/Modal';
import LoadingSpinner from '../UI/LoadingSpinner';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Table from '../UI/Table';
import './AdminPanel.css';

const AdminPanel = () => {
  const { isAdmin, user: currentUser } = useAuth();
  const { addToast } = useToast();

  // Estados principales
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState('');

  // Estados para modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUploadConfirmModal, setShowUploadConfirmModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  // Estados para formularios
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'cliente',
    activo: true
  });
  const [formLoading, setFormLoading] = useState(false);

  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');
  const [statusFilter, setStatusFilter] = useState('todos');
  const [sortBy, setSortBy] = useState('fecha_registro');
  const [sortOrder, setSortOrder] = useState('desc');

  // Verificar permisos de administrador
  useEffect(() => {
    if (!isAdmin()) {
      addToast('Acceso denegado. Se requieren permisos de administrador.', 'error');
      return;
    }
  }, [isAdmin, addToast]);

  // Cargar usuarios
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar usuarios');
      }

      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users || data.data);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message);
      addToast('Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Manejar cambios en formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validar email (solo Gmail y Hotmail)
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return false;
    }
    // Solo permitir Gmail y Hotmail
    const domain = email.toLowerCase().split('@')[1];
    const allowedDomains = ['gmail.com', 'hotmail.com', 'hotmail.es', 'hotmail.com.ar', 'hotmail.com.mx'];
    return allowedDomains.includes(domain);
  };

  // Validar contraseña
  const validatePassword = (password) => {
    if (!password || password.trim() === '') {
      return { valid: true }; // Permitir contraseña vacía en edición (no se actualiza)
    }

    // Máximo 12 caracteres
    if (password.length > 12) {
      return { valid: false, message: 'La contraseña debe tener máximo 12 caracteres' };
    }

    // Mínimo 6 caracteres
    if (password.length < 6) {
      return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    // Al menos una mayúscula
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
    }

    // Al menos un símbolo especial
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { valid: false, message: 'La contraseña debe contener al menos un símbolo especial' };
    }

    return { valid: true };
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();

    // Validar email antes de enviar
    if (!validateEmail(formData.email)) {
      addToast('Solo se permiten emails de Gmail o Hotmail', 'error');
      return;
    }

    // Validar contraseña
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      addToast(passwordValidation.message, 'error');
      return;
    }

    setFormLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        addToast('Usuario creado exitosamente', 'success');
        setShowCreateModal(false);
        resetForm();
        fetchUsers();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      addToast(error.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Editar usuario
  const handleEditUser = async (e) => {
    e.preventDefault();

    // Validar email antes de enviar (si se está actualizando)
    if (formData.email && !validateEmail(formData.email)) {
      addToast('Solo se permiten emails de Gmail o Hotmail', 'error');
      return;
    }

    // Validar contraseña (solo si se está actualizando)
    if (formData.password && formData.password.trim() !== '') {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        addToast(passwordValidation.message, 'error');
        return;
      }
    }

    setFormLoading(true);

    try {
      // Preparar datos para envío (excluir password vacío y asegurar tipos correctos)
      const updateData = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        rol: formData.rol,
        activo: formData.activo === true || formData.activo === 'true' || formData.activo === 1
      };

      // Solo incluir password si no está vacío
      if (formData.password && formData.password.trim() !== '') {
        updateData.password = formData.password;
      }

      console.log('Enviando datos de actualización:', updateData);
      console.log('ID del usuario:', selectedUser.id);

      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parseando respuesta:', parseError);
        throw new Error('Error al procesar la respuesta del servidor');
      }

      console.log('Respuesta del servidor:', data);

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        addToast('Usuario actualizado exitosamente', 'success');
        setShowEditModal(false);
        resetForm();
        fetchUsers();
      } else {
        throw new Error(data.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      addToast(error.message || 'Error al actualizar usuario', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!selectedUser) {
      addToast('No se ha seleccionado un usuario para eliminar', 'error');
      return;
    }

    setFormLoading(true);

    try {
      console.log('Eliminando usuario con ID:', selectedUser.id);

      const response = await fetch(`http://localhost:5000/api/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      console.log('Respuesta del servidor (eliminar):', data);

      if (data.success) {
        console.log('Usuario eliminado exitosamente, actualizando lista...');
        addToast('Usuario eliminado exitosamente', 'success');
        setShowDeleteModal(false);
        setSelectedUser(null);
        // Forzar actualización de la lista
        await fetchUsers();
        console.log('Lista de usuarios actualizada');
      } else {
        throw new Error(data.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      addToast(error.message || 'Error al eliminar usuario', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      password: '',
      rol: 'cliente',
      activo: true
    });
    setSelectedUser(null);
  };

  // Abrir modal de edición
  const openEditModal = (user) => {
    console.log('Opening edit modal for user:', user);

    if (!user || !user.id) {
      addToast('Usuario no válido para editar', 'error');
      return;
    }

    setSelectedUser(user);
    setFormData({
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      email: user.email || '',
      password: '', // No pre-llenar contraseña
      rol: user.rol || 'cliente',
      activo: user.activo !== undefined ? user.activo : true
    });
    setShowEditModal(true);
  };

  // Abrir modal de eliminación
  const openDeleteModal = (user) => {
    console.log('Opening delete modal for user:', user);

    if (!user || !user.id) {
      addToast('Usuario no válido para eliminar', 'error');
      return;
    }

    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Manejar selección de archivo Excel
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea un archivo Excel
      const validExtensions = ['.xlsx', '.xls', '.xlsm'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        addToast('Por favor selecciona un archivo Excel (.xlsx, .xls, .xlsm)', 'error');
        e.target.value = ''; // Limpiar el input
        return;
      }

      setSelectedFile(file);
      setShowUploadConfirmModal(true);
    }
  };

  // Manejar carga de datos
  const handleUploadData = async () => {
    if (!selectedFile) {
      addToast('Por favor selecciona un archivo Excel', 'error');
      return;
    }

    setUploadLoading(true);
    setShowUploadConfirmModal(false);

    try {
      const formData = new FormData();
      formData.append('excelFile', selectedFile);

      console.log('📤 Enviando archivo al servidor:', selectedFile.name);
      console.log('🔗 URL de la petición: http://localhost:5000/api/data/upload');

      const response = await fetch('http://localhost:5000/api/data/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
          // NO incluir 'Content-Type': 'multipart/form-data' - el navegador lo hace automáticamente
        },
        body: formData
      });

      console.log('📥 Respuesta del servidor:', response.status, response.statusText);

      let data;
      try {
        const text = await response.text();
        console.log('📄 Respuesta texto:', text);
        data = JSON.parse(text);
        console.log('📊 Datos recibidos:', data);
      } catch (parseError) {
        console.error('❌ Error parseando respuesta:', parseError);
        throw new Error(`Error al procesar la respuesta del servidor: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        throw new Error(data.message || data.error || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.success) {
        addToast(
          `Datos cargados exitosamente: ${data.data.insertedRows} filas insertadas de ${data.data.totalRows} totales`,
          'success'
        );
        if (data.data.errorRows > 0) {
          addToast(
            `Advertencia: ${data.data.errorRows} filas tuvieron errores`,
            'warning'
          );
        }
        setSelectedFile(null);
        setShowUploadModal(false);
        // Limpiar el input file
        const fileInput = document.getElementById('excel-file-input');
        if (fileInput) fileInput.value = '';
      } else {
        // Mostrar error detallado
        let errorMsg = data.error || data.message || 'Error al cargar los datos';

        if (data.code) {
          errorMsg += ` (Código: ${data.code})`;
        }
        if (data.detail) {
          errorMsg += `. ${data.detail}`;
        }
        if (data.column) {
          errorMsg += `. Columna problemática: ${data.column}`;
        }

        console.error('❌ Error detallado del servidor:', data);
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('❌ Error uploading data:', error);
      console.error('❌ Datos completos del error:', error);
      const errorMessage = error.message || 'Error al cargar los datos. Verifica la consola para más detalles.';
      addToast(errorMessage, 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  // Filtrar y ordenar usuarios
  const filteredUsers = users
    .filter(user => {
      if (!user) return false;

      const matchesSearch = !searchTerm ||
        (user.nombre && user.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.apellido && user.apellido.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesRole = roleFilter === 'todos' || user.rol === roleFilter;
      const matchesStatus = statusFilter === 'todos' ||
        (statusFilter === 'activos' && user.activo) ||
        (statusFilter === 'inactivos' && !user.activo);

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === 'fecha_registro') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Si no es admin, mostrar mensaje de acceso denegado
  if (!isAdmin()) {
    return (
      <div className="admin-panel">
        <div className="access-denied">
          <div className="access-denied-icon">🚫</div>
          <h2>Acceso Denegado</h2>
          <p>Se requieren permisos de administrador para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="loading-container">
          <LoadingSpinner />
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1 className="admin-title">
          <span className="admin-icon"><FaCrown /></span>
          Panel de Administración
        </h1>
        <p className="admin-subtitle">Gestiona usuarios y configuraciones del sistema</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="admin-stats">
        <Card className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{users.length}</h3>
            <p>Total Usuarios</p>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon"><FaCrown /></div>
          <div className="stat-content">
            <h3>{users.filter(u => u.rol === 'admin').length}</h3>
            <p>Administradores</p>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon"><FaUser /></div>
          <div className="stat-content">
            <h3>{users.filter(u => u.rol === 'cliente').length}</h3>
            <p>Clientes</p>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <h3>{users.filter(u => u.activo).length}</h3>
            <p>Usuarios Activos</p>
          </div>
        </Card>
      </div>

      {/* Controles y filtros */}
      <Card className="admin-controls">
        <div className="controls-row">
          <div className="search-section">
            <Input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
              variant="solid"
            />
          </div>

          <div className="filters-section">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los roles</option>
              <option value="admin">Administradores</option>
              <option value="cliente">Clientes</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="todos">Todos los estados</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className="filter-select"
            >
              <option value="fecha_registro-desc">Más recientes</option>
              <option value="fecha_registro-asc">Más antiguos</option>
              <option value="nombre-asc">Nombre A-Z</option>
              <option value="nombre-desc">Nombre Z-A</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
            </select>
          </div>

          <div className="action-buttons-group">
            <Button
              onClick={() => setShowUploadModal(true)}
              className="upload-button"
              variant="primary"
            >
              <span className="button-icon"><FaChartBar /></span>
              Cargar Datos
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="create-button"
            >
              <span className="button-icon">➕</span>
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de usuarios */}
      <Card className="users-table-container">
        <Table
          data={filteredUsers}
          columns={[
            {
              key: 'nombre',
              label: 'Nombre',
              render: (user) => (
                <div className="user-info">
                  <div className="user-avatar">
                    {user.nombre?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="user-name">{user.nombre || 'Sin nombre'} {user.apellido || 'Sin apellido'}</div>
                    <div className="user-email">{user.email || 'Sin email'}</div>
                  </div>
                </div>
              )
            },
            {
              key: 'rol',
              label: 'Rol',
              render: (user) => (
                <span className={`role-badge ${user.rol}`}>
                  {user.rol === 'admin' ? <><FaCrown className="inline mr-1" /> Admin</> : <><FaUser className="inline mr-1" /> Cliente</>}
                </span>
              )
            },
            {
              key: 'activo',
              label: 'Estado',
              render: (user) => (
                <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                  {user.activo ? <><FaCheckCircle className="inline mr-1" /> Activo</> : <><FaTimesCircle className="inline mr-1" /> Inactivo</>}
                </span>
              )
            },
            {
              key: 'fecha_registro',
              label: 'Fecha Registro',
              render: (user) => new Date(user.fecha_registro).toLocaleDateString()
            },
            {
              key: 'actions',
              label: 'Acciones',
              render: (user) => (
                <div className="action-buttons">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditModal(user)}
                    className="edit-button"
                  >
                    <FaEdit className="inline mr-1" /> Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteModal(user)}
                    className="delete-button"
                    disabled={user.id === currentUser?.id} // No permitir eliminar a sí mismo
                  >
                    <FaTrash className="inline mr-1" /> Eliminar
                  </Button>
                </div>
              )
            }
          ]}
        />
      </Card>

      {/* Modal de creación */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="Crear Nuevo Usuario"
        size="md"
      >
        <form onSubmit={handleCreateUser} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Nombre del usuario"
              />
            </div>
            <div className="form-group">
              <label>Apellido *</label>
              <Input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                placeholder="Apellido del usuario"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>Contraseña *</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              maxLength={12}
              placeholder="Ingresa la contraseña"
            />
            <div className="password-requirements">
              <p className="requirement-text">La contraseña debe cumplir:</p>
              <ul className="requirement-list">
                <li>Máximo 12 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un símbolo especial (!@#$%^&*...)</li>
              </ul>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol *</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                <span className="checkbox-text">Usuario activo</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={formLoading}
            >
              {formLoading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de edición */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        title="Editar Usuario"
        size="md"
      >
        <form onSubmit={handleEditUser} className="user-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <Input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
                placeholder="Nombre del usuario"
              />
            </div>
            <div className="form-group">
              <label>Apellido *</label>
              <Input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                required
                placeholder="Apellido del usuario"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email *</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="email@ejemplo.com"
            />
          </div>

          <div className="form-group">
            <label>Nueva Contraseña (opcional)</label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              maxLength={12}
              placeholder="Dejar vacío para mantener la actual"
            />
            <div className="password-requirements">
              <p className="requirement-text">Si cambias la contraseña, debe cumplir:</p>
              <ul className="requirement-list">
                <li>Máximo 12 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un símbolo especial (!@#$%^&*...)</li>
              </ul>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rol *</label>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleInputChange}
                required
                className="form-select"
              >
                <option value="cliente">Cliente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                <span className="checkbox-text">Usuario activo</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowEditModal(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={formLoading}
            >
              {formLoading ? 'Actualizando...' : 'Actualizar Usuario'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.nombre} ${selectedUser?.apellido}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de carga de datos */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          setSelectedFile(null);
          const fileInput = document.getElementById('excel-file-input');
          if (fileInput) fileInput.value = '';
        }}
        title="Cargar Datos desde Excel"
        size="md"
      >
        <div className="upload-form">
          <div className="upload-info">
            <p className="upload-warning">
              <FaExclamationTriangle className="inline mr-2" /> <strong>Advertencia:</strong> Esta acción eliminará todos los datos existentes en la tabla "hoja1" y cargará los nuevos datos desde el archivo Excel.
            </p>
            <p className="upload-instructions">
              Por favor, selecciona un archivo Excel (.xlsx, .xls, .xlsm) que contenga los datos a cargar.
              El archivo debe tener la primera fila como encabezados de columnas.
            </p>
          </div>

          <div className="file-input-wrapper">
            <label htmlFor="excel-file-input" className="file-input-label">
              <span className="file-input-icon">📁</span>
              <span className="file-input-text">
                {selectedFile ? selectedFile.name : 'Seleccionar archivo Excel...'}
              </span>
            </label>
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx,.xls,.xlsm,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              disabled={uploadLoading}
            />
          </div>

          {selectedFile && (
            <div className="file-info">
              <p><strong>Archivo seleccionado:</strong> {selectedFile.name}</p>
              <p><strong>Tamaño:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
                const fileInput = document.getElementById('excel-file-input');
                if (fileInput) fileInput.value = '';
              }}
              disabled={uploadLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => setShowUploadConfirmModal(true)}
              disabled={!selectedFile || uploadLoading}
            >
              {uploadLoading ? 'Cargando...' : 'Continuar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de confirmación de carga */}
      <ConfirmModal
        isOpen={showUploadConfirmModal}
        onClose={() => {
          setShowUploadConfirmModal(false);
        }}
        onConfirm={handleUploadData}
        title="Confirmar Carga de Datos"
        message={
          <div>
            <p><strong>¿Estás seguro de que deseas cargar los datos?</strong></p>
            <p>Esta acción:</p>
            <ul style={{ textAlign: 'left', marginTop: '10px' }}>
              <li>Eliminará <strong>TODOS</strong> los datos existentes en la tabla "hoja1"</li>
              <li>Cargará los nuevos datos desde el archivo: <strong>{selectedFile?.name}</strong></li>
            </ul>
            <p style={{ marginTop: '15px', color: '#d32f2f', fontWeight: 'bold' }}>
              <FaExclamationTriangle className="inline mr-2" /> Esta acción no se puede deshacer.
            </p>
          </div>
        }
        confirmText="Sí, cargar datos"
        cancelText="Cancelar"
        type="danger"
      />

      {/* Modal de carga en progreso */}
      <Modal
        isOpen={uploadLoading}
        onClose={() => { }} // No permitir cerrar durante la carga
        title="Cargando Datos"
        size="md"
      >
        <div className="upload-loading-container" style={{ textAlign: 'center', padding: '20px' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold', color: '#1976d2' }}>
            Espere, esta acción puede tardar varios minutos
          </p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            Por favor no cierre esta ventana ni recargue la página.
          </p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            <FaUpload className="inline mr-2" />
            Procesando archivo Excel...
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default AdminPanel;
