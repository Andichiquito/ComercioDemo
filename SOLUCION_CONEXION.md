# 🔧 Solución Definitiva para Problemas de Conexión

## 🚀 ¡Problema Resuelto!

He actualizado tu proyecto para que **NO tengas que configurar la conexión cada vez**. Aquí está todo lo que necesitas hacer:

## 📋 Pasos para Solucionar (Solo una vez)

### 1. Crear archivo `.env` (IMPORTANTE)
Crea un archivo llamado `.env` en la raíz del proyecto con este contenido:

```env
# Configuración de la Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=Comercio
DB_USER=postgres
DB_PASSWORD=Racquet12

# Configuración del Servidor
PORT=5000
NODE_ENV=development

# Configuración de CORS
FRONTEND_URL=http://localhost:3000

# Configuración de JWT (para autenticación)
JWT_SECRET=tu_jwt_secret_super_seguro_aqui
JWT_EXPIRES_IN=24h
```

### 2. Verificar que PostgreSQL esté ejecutándose
- Abre el **Administrador de servicios** de Windows
- Busca **"postgresql-x64-XX"** (donde XX es la versión)
- Si no está ejecutándose, haz clic derecho → **Iniciar**

### 3. ¡Listo! Ahora usa estos comandos:

```bash
# Para iniciar solo el backend (con verificación automática)
npm run server

# Para iniciar frontend y backend juntos
npm run dev

# Para desarrollo con auto-reload
npm run server:dev
```

## 🎯 ¿Qué Cambié?

### ✅ Configuración Automática
- **Variables de entorno**: Ahora usa `.env` en lugar de credenciales hardcodeadas
- **Verificación automática**: El servidor verifica PostgreSQL antes de iniciar
- **Mensajes claros**: Te dice exactamente qué hacer si hay problemas

### ✅ Scripts Mejorados
- `npm run server` - Inicia con verificación automática
- `npm run server:simple` - Inicia sin verificación (como antes)
- `npm run dev` - Frontend + Backend juntos
- `npm run server:dev` - Desarrollo con auto-reload

### ✅ Manejo de Errores
- **Detección automática** de problemas de conexión
- **Instrucciones claras** para solucionarlos
- **Timeouts mejorados** para conexiones más estables

## 🔍 Si Aún Tienes Problemas

### Error: "No se pudo conectar a PostgreSQL"
1. **Verifica que PostgreSQL esté ejecutándose**:
   ```bash
   # En PowerShell (como administrador)
   net start postgresql-x64-17
   ```

2. **Verifica que la base de datos exista**:
   - Abre pgAdmin o psql
   - Crea la base de datos "Comercio" si no existe

3. **Verifica las credenciales**:
   - Usuario: `postgres`
   - Contraseña: `Racquet12`
   - Puerto: `5432`

### Error: "Puerto 5000 en uso"
```bash
# Cambia el puerto en el archivo .env
PORT=5001
```

## 🎉 ¡Ya No Más Problemas!

Una vez que hagas estos pasos **UNA SOLA VEZ**, podrás usar:
- `npm run server` - ¡Y listo!
- `npm run dev` - ¡Frontend y backend juntos!

**No más configuración manual cada vez** 🚀

## 📞 Si Necesitas Ayuda

Si sigues teniendo problemas, ejecuta:
```bash
npm run server
```

Y el sistema te dirá exactamente qué está mal y cómo solucionarlo.
