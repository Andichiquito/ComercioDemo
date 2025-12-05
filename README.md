


Comercio Internacional – Proyecto de sistemas III


Integrantes: ANDRES GUZMAN PUENTE
                           VICTOR HUGO CLAROS GUTIERREZ
Docente: Gaston Silva





                               Gestion 2-2025
1. Integrantes - Roles
- Andres Guzman Puente – Team Leader | UI/UX Designer | QA Tester | FrontEnd Developer
- Victor Hugo Claros Gutierrez – Backend Developer | DevOps | UI/UX Designer | BackEnd Developer | Arquitecto de Software
2. Introducción
El Sistema de Comercio Internacional es una plataforma web diseñada para la gestión, análisis y visualización de datos relacionados con comercio exterior.
Permite cargar datos desde Excel, procesarlos automáticamente, generar gráficos interactivos, administrar usuarios y realizar consultas complejas.
3. Descripción / Objetivo del Proyecto
El objetivo es centralizar y analizar información de comercio internacional, facilitando la toma de decisiones mediante dashboards, KPIs, estadísticas, filtros avanzados,
carga masiva de datos y funcionalidades administrativas.
4. Requisitos Funcionales del Sistema
1. Cargar archivos Excel con datos comerciales.
2. Procesar automáticamente columnas, tipos de datos y filas.
3. Generar KPIs y estadísticas.
4. Mostrar dashboards gráficos.
5. Gestión de usuarios (CRUD).
6. Autenticación JWT.
7. Sistema de roles.
8. Exportar datos.
9. Vistas protegidas.
10. Panel de administración.
5. Arquitectura del Software
El sistema utiliza una arquitectura por capas:
- Frontend: React, gráficos con Chart.js.
- Backend: Node.js, controladores, rutas, JWT, bcrypt.
- Base de Datos: PostgreSQL con pg.Pool.
- Patrones: MVC, Repository Pattern, DTOs, Token-Based Auth.
Comunicación: Frontend → API REST → PostgreSQL
6. Base de Datos
a. Diagrama textual:
- usuarios(id, nombre, email, password_hash, rol, estado)
- hoja1(id, pais, producto, anio, mes, valor, transporte) 

b. Carpeta en GIT:
database/
   01_schema.sql
   02_seed.sql
   03_views.sql

c. Script Simple:
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(120),
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) NOT NULL,
  estado BOOLEAN DEFAULT true
);

CREATE TABLE hoja1 (
  id SERIAL PRIMARY KEY,
  pais VARCHAR(120),
  producto VARCHAR(120),
  anio INT,
  mes INT,
  valor NUMERIC(18,2),
  transporte VARCHAR(80)
);
8. Roles y Credenciales
Admin:
 - Usuario: admin
 - Contraseña: Admin123*

User:
 - Usuario: user1
 - Contraseña: User123*

Base de Datos:
 - Usuario: postgres
 - Contraseña: admin123
 - Base: comercio
9. Requisitos del Sistema
Cliente:
Hardware mínimo: 4GB RAM, CPU dual core
Software: Navegador actualizado

Servidor:
Hardware: 2–4 vCPU, 4–8GB RAM
Software: Ubuntu Server 22.04, Docker, PostgreSQL 17, Docker Compose
10. Instalación y Configuración
1. Clonar repositorio
2. Instalar dependencias con npm install
3. Crear archivo .env con credenciales
4. Ejecutar npm run dev para modo desarrollo

Backend variables:
DB_USER=postgres
DB_PASS=admin123
DB_HOST=localhost
JWT_SECRET=supersecret
11. Procedimiento de Hosting en AWS
Sitio web: Construcción con npm run build
API backend en puerto 5000
BD en contenedor postgres

PASOS AWS:
1. Crear instancia EC2
2. Instalar Docker:
   sudo apt install docker.io
3. Instalar docker-compose
4. Clonar proyecto
5. Ejecutar docker-compose up -d --build
6. Verificar docker ps
12. GIT
Rama principal:
 - main

Ramas por developer:
 - feature/frontend
 - feature/backend
 - fix/bug-xxx

Entregables:
 - Build en /build
 - Base de datos en /database
13. Dockerizado
Proceso:
docker-compose.yml con servicios backend, frontend y postgres.

Ejecución:
docker-compose up -d --build

Credenciales:
BD: postgres / admin123
Sistema: admin / Admin123*
14. Personalización y Configuración
Personalizable:
- Colores del dashboard
- Logos
- Nombre del sistema
- Configuración de .env
- Columnas esperadas en carga masiva
15. Seguridad
Incluye:
- JWT
- Bcrypt
- Rate limiting
- Validación de roles
- CORS
- HTTPS recomendado
- Sanitización de inputs
16. Depuración y Solución de Problemas
Logs:
docker logs backend -f
docker logs db -f

Errores comunes:
- No conecta a BD → revisar host/puerto/pass
- Token inválido → revisar expiración
- Excel inválido → revisar encabezados
17. Glosario
CRUD: Crear, leer, actualizar, eliminar
JWT: Token de autenticación
API REST: Servicios HTTP
Build: Versión de producción
Transacción: Operaciones atómicas
Fuzzy Matching: Coincidencia aproximada
18. Referencias
PostgreSQL Docs
React Documentation
Express Documentation
AWS EC2 Documentation
Docker Documentation
19. Herramientas
Lenguajes:
 - JavaScript, SQL

Frameworks:
 - React, Express

APIs externas:
 - Chart.js, Multer, XLSX
20. Bibliografía
Sommerville – Software Engineering
Gamma et al. – Design Patterns
Fowler – Refactoring
