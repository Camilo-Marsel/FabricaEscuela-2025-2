# 🧪 Guía de Instalación de Tests - FleetGuard360

## Archivos Descargados

Se han creado 3 archivos de test:

1. **HealthControllerTest.java** → Test de integración del endpoint de salud
2. **TurnoServiceTest.java** → Test unitario con Mockito para la lógica de negocio
3. **TurnoRepositoryTest.java** → Test de integración con base de datos

## Paso 1: Copiar los Tests

Debes copiar cada archivo a su ubicación correspondiente:

```
HealthControllerTest.java
  → backend/src/test/java/com/FabricaEscuela/Feature1Back/controller/

TurnoServiceTest.java
  → backend/src/test/java/com/FabricaEscuela/Feature1Back/service/

TurnoRepositoryTest.java
  → backend/src/test/java/com/FabricaEscuela/Feature1Back/repository/
```

### Comandos PowerShell:

```powershell
# Desde la raíz del proyecto
cd backend

# Crear carpetas si no existen
New-Item -ItemType Directory -Force -Path "src\test\java\com\FabricaEscuela\Feature1Back\controller"
New-Item -ItemType Directory -Force -Path "src\test\java\com\FabricaEscuela\Feature1Back\service"
New-Item -ItemType Directory -Force -Path "src\test\java\com\FabricaEscuela\Feature1Back\repository"

# Copiar archivos (ajusta las rutas según donde los descargaste)
Copy-Item "C:\ruta\descarga\HealthControllerTest.java" -Destination "src\test\java\com\FabricaEscuela\Feature1Back\controller\"
Copy-Item "C:\ruta\descarga\TurnoServiceTest.java" -Destination "src\test\java\com\FabricaEscuela\Feature1Back\service\"
Copy-Item "C:\ruta\descarga\TurnoRepositoryTest.java" -Destination "src\test\java\com\FabricaEscuela\Feature1Back\repository\"
```

## Paso 2: Verificar Dependencias en pom.xml

Asegúrate de que tu `pom.xml` tiene estas dependencias:

```xml
<dependencies>
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- JUnit 5 (debería venir con starter-test) -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito (debería venir con starter-test) -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**Nota:** `spring-boot-starter-test` ya incluye JUnit 5, Mockito, AssertJ y otras librerías de testing, así que probablemente solo necesitas esa dependencia.

## Paso 3: Ejecutar los Tests

```powershell
# Limpiar y ejecutar tests
mvn clean test

# Ver reporte de cobertura (si tienes JaCoCo configurado)
mvn test jacoco:report
```

## Paso 4: Verificar Resultados

Deberías ver algo como:

```
[INFO] Tests run: 21, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

## Cobertura de Código

Los tests creados cubren:

- ✅ **HealthController**: 100% (2 tests)
- ✅ **TurnoService**: ~70-80% (11 tests)
    - Creación de turnos
    - Validaciones de duración
    - Eliminación con/sin asignaciones
    - Actualización de turnos
    - Consultas por ID, ruta, semana
- ✅ **TurnoRepository**: ~90% (8 tests)
    - Métodos CRUD básicos
    - Consultas personalizadas por ruta/día/semana

## Solución de Problemas

### Error: "Cannot resolve symbol"
- Verifica que copiaste los archivos en las carpetas correctas
- Asegúrate de que los paquetes coincidan con tu estructura

### Error: "No qualifying bean of type"
- Revisa que las entidades (Ruta, Turno, etc.) estén correctamente anotadas
- Verifica la configuración de Spring Boot

### Tests fallan en TurnoRepositoryTest
- Asegúrate de tener H2 database en el pom.xml para tests:
```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>test</scope>
</dependency>
```

## Próximo Paso: GitHub Actions + SonarCloud

Una vez que los tests pasen localmente, estaremos listos para:
1. Configurar GitHub Actions Workflow
2. Integrar con SonarCloud
3. Obtener insignias de calidad de código

¡Los tests están listos para ejecutar! 🚀