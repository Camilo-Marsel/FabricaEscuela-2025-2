package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.EstadoTurno;
import com.FabricaEscuela.Feature1Back.entity.Ruta;
import com.FabricaEscuela.Feature1Back.entity.Turno;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class TurnoRepositoryTest {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private RutaRepository rutaRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    private Ruta ruta;

    @BeforeEach
    void setUp() {
        // Limpiar datos en el orden correcto (primero las asignaciones, luego los turnos)
        asignacionTurnoRepository.deleteAll();
        turnoRepository.deleteAll();
        rutaRepository.deleteAll();

        // Crear ruta de prueba con TODOS los campos obligatorios
        ruta = new Ruta();
        ruta.setNombre("Ruta Test");
        ruta.setOrigen("Origen Test");
        ruta.setDestino("Destino Test");
        ruta.setDuracionEnMinutos(480);
        ruta = rutaRepository.save(ruta);
    }

    @AfterEach
    void tearDown() {
        // Limpiar después de cada test en el orden correcto
        asignacionTurnoRepository.deleteAll();
        turnoRepository.deleteAll();
        rutaRepository.deleteAll();
    }

    @Test
    void findByRuta_debeRetornarTurnosDeLaRuta() {
        // Arrange
        Turno turno1 = crearYGuardarTurno(DayOfWeek.MONDAY, 1);
        Turno turno2 = crearYGuardarTurno(DayOfWeek.TUESDAY, 1);

        // Act
        List<Turno> resultado = turnoRepository.findByRuta(ruta);

        // Assert
        assertNotNull(resultado);
        assertEquals(2, resultado.size());
    }

    @Test
    void findByRutaAndNumeroSemana_debeRetornarTurnosFiltrados() {
        // Arrange
        crearYGuardarTurno(DayOfWeek.MONDAY, 1);
        crearYGuardarTurno(DayOfWeek.MONDAY, 2);

        // Act
        List<Turno> resultado = turnoRepository.findByRutaAndNumeroSemana(ruta, 1);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1, resultado.get(0).getNumeroSemana());
    }

    @Test
    void findByRutaAndDiaSemana_debeRetornarTurnosDelDia() {
        // Arrange
        crearYGuardarTurno(DayOfWeek.MONDAY, 1);
        crearYGuardarTurno(DayOfWeek.TUESDAY, 1);

        // Act
        List<Turno> resultado = turnoRepository.findByRutaAndDiaSemana(ruta, DayOfWeek.MONDAY);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(DayOfWeek.MONDAY, resultado.get(0).getDiaSemana());
    }

    @Test
    void findByRutaAndDiaSemanaAndNumeroSemana_debeRetornarTurnoEspecifico() {
        // Arrange
        crearYGuardarTurno(DayOfWeek.MONDAY, 1);
        crearYGuardarTurno(DayOfWeek.MONDAY, 2);
        crearYGuardarTurno(DayOfWeek.TUESDAY, 1);

        // Act
        List<Turno> resultado = turnoRepository.findByRutaAndDiaSemanaAndNumeroSemana(
                ruta, DayOfWeek.MONDAY, 1);

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(DayOfWeek.MONDAY, resultado.get(0).getDiaSemana());
        assertEquals(1, resultado.get(0).getNumeroSemana());
    }

    @Test
    void save_debeGuardarTurnoCorrectamente() {
        // Arrange
        Turno turno = Turno.builder()
                .ruta(ruta)
                .diaSemana(DayOfWeek.WEDNESDAY)
                .horaInicio(LocalTime.of(6, 0))
                .horaFin(LocalTime.of(14, 0))
                .duracionHoras(8)
                .numeroSemana(1)
                .estado(EstadoTurno.ACTIVO)
                .build();

        // Act
        Turno turnoGuardado = turnoRepository.save(turno);

        // Assert
        assertNotNull(turnoGuardado);
        assertNotNull(turnoGuardado.getId());
        assertEquals(DayOfWeek.WEDNESDAY, turnoGuardado.getDiaSemana());
        assertEquals(8, turnoGuardado.getDuracionHoras());
    }

    @Test
    void delete_debeEliminarTurno() {
        // Arrange
        Turno turno = crearYGuardarTurno(DayOfWeek.FRIDAY, 1);
        Long turnoId = turno.getId();

        // Act
        turnoRepository.delete(turno);

        // Assert
        assertFalse(turnoRepository.findById(turnoId).isPresent());
    }

    @Test
    void findAll_conMultiplesTurnos_debeRetornarTodos() {
        // Arrange
        crearYGuardarTurno(DayOfWeek.MONDAY, 1);
        crearYGuardarTurno(DayOfWeek.TUESDAY, 1);
        crearYGuardarTurno(DayOfWeek.WEDNESDAY, 1);

        // Act
        List<Turno> resultado = turnoRepository.findAll();

        // Assert
        assertNotNull(resultado);
        assertTrue(resultado.size() >= 3);
    }

    // Método auxiliar para crear y guardar turnos
    private Turno crearYGuardarTurno(DayOfWeek dia, int numeroSemana) {
        Turno turno = Turno.builder()
                .ruta(ruta)
                .diaSemana(dia)
                .horaInicio(LocalTime.of(6, 0))
                .horaFin(LocalTime.of(14, 0))
                .duracionHoras(8)
                .numeroSemana(numeroSemana)
                .estado(EstadoTurno.ACTIVO)
                .build();
        return turnoRepository.save(turno);
    }
}