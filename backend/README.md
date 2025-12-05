# Backend - Conexión PostgreSQL

## Configuración de la Base de Datos

La aplicación está configurada para conectarse a PostgreSQL con los siguientes parámetros:

- **Host**: localhost
- **Puerto**: 5432
- **Base de datos**: Comercio
- **Usuario**: postgres
- **Contraseña**: Racquet12

## Estructura del Proyecto

```
backend/
├── config/
│   └── database.js      # Configuración de la conexión a PostgreSQL
├── routes/
│   └── example.js       # Rutas de ejemplo para probar la conexión
├── models/              # Modelos de datos (para futuras implementaciones)
├── server.js           # Servidor principal Express
└── README.md           # Este archivo
```

## Scripts Disponibles

```bash
# Iniciar solo el servidor backend
npm run server

# Iniciar servidor con auto-reload (desarrollo)
npm run server:dev

# Iniciar frontend y backend simultáneamente
npm run dev
```

## Endpoints Disponibles

### Pruebas de Conexión

- `GET /` - Página principal del servidor
- `GET /api/test-db` - Probar conexión a la base de datos
- `GET /api/health` - Estado del servidor

### Rutas de Ejemplo

- `GET /api/example/users` - Obtener información de PostgreSQL
- `POST /api/example/create-table` - Crear tabla de prueba
- `POST /api/example/insert-data` - Insertar datos de ejemplo
- `GET /api/example/data` - Obtener todos los datos de prueba

## Uso de la Base de Datos

### Importar la configuración

```javascript
const { query, getClient, testConnection } = require('./config/database');
```

### Ejecutar consultas

```javascript
// Consulta simple
const result = await query('SELECT * FROM mi_tabla');

// Consulta con parámetros
const result = await query('SELECT * FROM usuarios WHERE id = $1', [userId]);
```

### Obtener un cliente del pool

```javascript
const client = await getClient();
try {
  await client.query('BEGIN');
  // tus consultas aquí
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK');
  throw error;
} finally {
  client.release();
}
```

## Próximos Pasos

1. Asegúrate de que PostgreSQL esté ejecutándose
2. Verifica que la base de datos "Comercio" exista
3. Ejecuta `npm run server` para iniciar el backend
4. Visita `http://localhost:5000/api/test-db` para probar la conexión
5. Comienza a crear tus propias rutas y modelos según necesites
