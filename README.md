# Etiquetas de calidad

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Camilo-Marsel_FabricaEscuela-2025-2&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Camilo-Marsel_FabricaEscuela-2025-2)

---

# FleetGuard360

Sistema integral de monitoreo y gestión de flotas para transporte de pasajeros.

---

## Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
3. [Configuración del Backend](#configuración-del-backend)
4. [Configuración del Frontend](#configuración-del-frontend)
5. [Ejecución del Proyecto](#ejecución-del-proyecto)
6. [Descripción del Proyecto](#descripción-del-proyecto)
7. [Estado Actual del Desarrollo](#estado-actual-del-desarrollo)
8. [Arquitectura Técnica](#arquitectura-técnica)
9. [Funcionalidades Implementadas](#funcionalidades-implementadas)
10. [Pendientes y Roadmap](#pendientes-y-roadmap)

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Java 17** o superior (JDK)
- **Maven 3.6+**
- **Node.js 16+** y **npm**
- **PostgreSQL 12+**
- **Git**

---

## Configuración de la Base de Datos

### 1. Crear la Base de Datos

Abre tu cliente de PostgreSQL (pgAdmin, psql, etc.) y ejecuta:

```sql
CREATE DATABASE fleetguard360;
```

### 2. Crear el Usuario y Asignar Permisos

```sql
CREATE USER fleetguard_user WITH PASSWORD 'tu_contraseña_segura';

GRANT ALL PRIVILEGES ON DATABASE fleetguard360 TO fleetguard_user;

-- Conectarse a la base de datos
\c fleetguard360

GRANT ALL PRIVILEGES ON SCHEMA public TO fleetguard_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO fleetguard_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO fleetguard_user;
```

### 3. Verificar la Conexión

```bash
psql -U fleetguard_user -d fleetguard360 -h localhost
```

---

## Configuración del Backend

### 1. Navegar al Directorio del Backend

```bash
cd backend
```

### 2. Configurar Variables de Entorno

Edita el archivo `src/main/resources/application.properties` o `application.yml` con tus credenciales:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fleetguard360
spring.datasource.username=fleetguard_user
spring.datasource.password=tu_contraseña_segura

# JWT Configuration
jwt.secret=tu_clave_secreta_jwt
jwt.expiration=86400000

# Email Configuration (IMPORTANTE: Cambiar por tu correo)
spring.mail.username=tu_correo@gmail.com
spring.mail.password=tu_contraseña_de_aplicacion
```

### 3. Actualizar Usuarios de Prueba

**⚠️ IMPORTANTE:** Los códigos de verificación y notificaciones se enviarán al correo configurado.

Edita el archivo `src/main/java/com/fleetguard/Application.java` (o el Main de tu backend) y actualiza los usuarios de prueba con tu correo:

```java
// Busca la sección de usuarios de prueba y cambia los correos
User adminUser = new User();
adminUser.setEmail("tu_correo@example.com");  // ← CAMBIAR AQUÍ
adminUser.setUsername("admin");
// ...

User conductorUser = new User();
conductorUser.setEmail("tu_otro_correo@example.com");  // ← CAMBIAR AQUÍ
conductorUser.setUsername("conductor");
// ...
```

### 4. Instalar Dependencias

No es necesario usar un entorno virtual para el backend de Java. Maven manejará todas las dependencias:

```bash
mvn clean install
```

O si prefieres omitir los tests:

```bash
mvn clean install -DskipTests
```

---

## Configuración del Frontend

### 1. Navegar al Directorio del Frontend

```bash
cd frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar la URL del Backend (Opcional)

Si tu backend no corre en `http://localhost:8080`, edita el archivo de configuración correspondiente (ejemplo: `.env` o `config.js`):

```env
REACT_APP_API_URL=http://localhost:8080/api
```

---

## Ejecución del Proyecto

### Opción 1: Ejecución Manual

#### Backend

Desde el directorio `backend`:

```bash
mvn spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

#### Frontend

Desde el directorio `frontend`:

```bash
npm start
```

El frontend estará disponible en: `http://localhost:3000`

### Opción 2: Ejecución con Scripts

Si tienes scripts configurados en el `package.json` o archivos `.sh`:

```bash
# Backend
./start-backend.sh

# Frontend
npm run dev
```

### Verificación

- **Backend:** Accede a `http://localhost:8080/actuator/health` (si tienes Spring Actuator)
- **Frontend:** Abre tu navegador en `http://localhost:3000`

---

## Descripción del Proyecto

**FleetGuard360** es un sistema integral de monitoreo y gestión de flotas diseñado específicamente para empresas de transporte de pasajeros. El sistema permite supervisar en tiempo real el estado de los vehículos, gestionar conductores, crear y asignar turnos, y monitorear rutas de manera eficiente.

### Objetivo Principal

Proporcionar una plataforma centralizada que optimice la operación de flotas de transporte mediante:

- Gestión de conductores y turnos
- Monitoreo de vehículos en tiempo real
- Administración de rutas y horarios
- Control de acceso basado en roles
- Reportes y análisis de operaciones

---

## Estado Actual del Desarrollo

### Funcionalidad Completada: Feature 1 - Gestión de Conductores

El módulo de gestión de conductores está operativo e incluye:

- ✅ Creación y gestión de plantillas de turnos
- ✅ Sistema de autenticación con JWT
- ✅ Control de acceso basado en roles (ADMIN, CONDUCTOR, etc.)
- ✅ Endpoints RESTful para operaciones CRUD
- ✅ Validaciones de autorización en endpoints críticos
- ✅ Manejo de turnos con información de rutas anidadas
- ✅ DTOs optimizados para serialización frontend-backend

### Correcciones Técnicas Implementadas

Durante el desarrollo se resolvieron problemas críticos:

1. **Autenticación y Autorización:** Implementación correcta de verificación de rol ADMIN para endpoints de creación de plantillas
2. **Loops Infinitos:** Corrección de lógica de creación de turnos con contadores de seguridad
3. **Serialización de Datos:** Actualización de DTOs para manejar correctamente objetos anidados (rutas dentro de turnos)

---

## Arquitectura Técnica

### Stack Tecnológico

**Backend:**
- Java 17
- Spring Boot 3.x
- Spring Security con JWT
- Spring Data JPA
- PostgreSQL
- Maven

**Frontend:**
- React 18
- React Router
- Axios para peticiones HTTP
- Context API para gestión de estado

### Arquitectura de Seguridad

```
Cliente → JWT Token → SecurityConfig → Role Verification → Controller → Service → Repository → Database
```

**Componentes Clave:**

- **SecurityConfig:** Configuración de Spring Security y filtros JWT
- **JwtAuthenticationFilter:** Validación de tokens en cada petición
- **RoleBasedAccess:** Verificación de roles (ADMIN, CONDUCTOR) en endpoints
- **AuthenticationService:** Generación y validación de tokens

### Flujo de Datos

```
Frontend (React) → REST API (Controllers) → Service Layer → Mappers/DTOs → Database (PostgreSQL)
```

**Componentes del Backend:**

1. **Controllers:** Exponen endpoints REST
2. **Services:** Lógica de negocio (ej. TurnoService)
3. **Repositories:** Capa de acceso a datos (Spring Data JPA)
4. **DTOs:** Objetos de transferencia de datos optimizados
5. **Mappers:** Conversión entre entidades y DTOs

---

## Funcionalidades Implementadas

### 1. Autenticación y Autorización

- Login con JWT
- Refresh tokens
- Control de acceso basado en roles
- Sesiones seguras

### 2. Gestión de Turnos

- Creación de plantillas de turnos (solo ADMIN)
- Asignación de conductores a turnos
- Gestión de horarios y rutas
- Visualización de turnos activos

### 3. Manejo de Rutas

- Definición de rutas con paradas
- Asociación de rutas a turnos
- Información detallada de cada ruta

### 4. Base de Datos

- Esquema relacional optimizado
- Migraciones con Flyway/Liquibase (si aplica)
- Índices para consultas frecuentes

---

## Pendientes y Roadmap

### Corto Plazo

- [ ] **Feature 2:** Monitoreo de vehículos en tiempo real
    - Integración con GPS
    - Visualización en mapa
    - Alertas de ubicación

- [ ] **Feature 3:** Gestión de vehículos
    - CRUD de vehículos
    - Historial de mantenimiento
    - Estado del vehículo

- [ ] **Feature 4:** Reportes y estadísticas
    - Dashboard administrativo
    - Reportes de turnos completados
    - Análisis de rutas

### Mediano Plazo

- [ ] Sistema de notificaciones push
- [ ] Aplicación móvil para conductores
- [ ] Integración con sistemas de pago
- [ ] Gestión de incidentes y reportes

### Largo Plazo

- [ ] Análisis predictivo con ML
- [ ] Optimización automática de rutas
- [ ] Sistema de calificaciones de conductores
- [ ] Integración con sistemas externos (ERP, CRM)

---

## Mejoras Técnicas Pendientes

### Backend

- [ ] Implementar tests unitarios completos
- [ ] Tests de integración para endpoints críticos
- [ ] Documentación con Swagger/OpenAPI
- [ ] Implementar caché con Redis
- [ ] Logging estructurado con ELK Stack
- [ ] Métricas y monitoreo con Prometheus

### Frontend

- [ ] Implementar tests con Jest y React Testing Library
- [ ] Optimización de rendimiento (lazy loading, memoization)
- [ ] Sistema de gestión de estado global (Redux/Zustand)
- [ ] Tema oscuro/claro
- [ ] Internacionalización (i18n)

### DevOps

- [ ] Configurar CI/CD pipeline
- [ ] Dockerización de la aplicación
- [ ] Despliegue en cloud (AWS/Azure/GCP)
- [ ] Configuración de ambientes (dev, staging, prod)

---

## Contribución

Para contribuir al proyecto:

1. Crea un branch desde `develop`
2. Realiza tus cambios siguiendo las convenciones de código
3. Escribe tests para nuevas funcionalidades
4. Crea un Pull Request con descripción detallada

---

## Licencia

[Especificar la licencia del proyecto]

---

## Contacto

Para preguntas o sugerencias sobre el proyecto, contacta al equipo de desarrollo.

---

**FleetGuard360** - Sistema de Gestión de Flotas © 2025
---
**UdeA - Camilo Cespedes**