package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.CrearTurnoRequest;
import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.*;
import com.FabricaEscuela.Feature1Back.mapper.TurnoMapper;
import com.FabricaEscuela.Feature1Back.repository.AsignacionTurnoRepository;
import com.FabricaEscuela.Feature1Back.repository.RutaRepository;
import com.FabricaEscuela.Feature1Back.repository.TurnoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TurnoServiceTest {

    @Mock
    private TurnoRepository turnoRepository;

    @Mock
    private RutaRepository rutaRepository;

    @Mock
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Mock
    private TurnoMapper turnoMapper;

    @InjectMocks
    private TurnoService turnoService;

    private Ruta rutaMock;
    private CrearTurnoRequest requestValido;
    private Turno turnoMock;
    private TurnoDTO turnoDTOMock;

    @BeforeEach
    void setUp() {
        // Configurar datos de prueba
        rutaMock = new Ruta();
        rutaMock.setId(1L);
        rutaMock.setNombre("Ruta Centro");

        requestValido = new CrearTurnoRequest();
        requestValido.setRutaId(1L);
        requestValido.setDiaSemana(DayOfWeek.MONDAY);
        requestValido.setHoraInicio(LocalTime.of(6, 0));
        requestValido.setHoraFin(LocalTime.of(14, 0)); // 8 horas
        requestValido.setNumeroSemana(1);

        turnoMock = Turno.builder()
                .id(1L)
                .ruta(rutaMock)
                .diaSemana(DayOfWeek.MONDAY)
                .horaInicio(LocalTime.of(6, 0))
                .horaFin(LocalTime.of(14, 0))
                .duracionHoras(8)
                .numeroSemana(1)
                .estado(EstadoTurno.ACTIVO)
                .build();

        turnoDTOMock = new TurnoDTO();
        turnoDTOMock.setId(1L);
        turnoDTOMock.setDiaSemana(DayOfWeek.MONDAY);
    }

    @Test
    void crearTurno_conDatosValidos_debeCrearTurnoExitosamente() {
        // Arrange
        when(rutaRepository.findById(1L)).thenReturn(Optional.of(rutaMock));
        when(turnoRepository.save(any(Turno.class))).thenReturn(turnoMock);
        when(turnoMapper.toDTO(any(Turno.class))).thenReturn(turnoDTOMock);

        // Act
        TurnoDTO resultado = turnoService.crearTurno(requestValido);

        // Assert
        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        verify(rutaRepository, times(1)).findById(1L);
        verify(turnoRepository, times(1)).save(any(Turno.class));
    }

    @Test
    void crearTurno_conRutaInexistente_debeLanzarExcepcion() {
        // Arrange
        when(rutaRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            turnoService.crearTurno(requestValido);
        });

        assertEquals("Ruta no encontrada", exception.getMessage());
        verify(turnoRepository, never()).save(any());
    }

    @Test
    void crearTurno_conMasDe8Horas_debeLanzarExcepcion() {
        // Arrange
        when(rutaRepository.findById(1L)).thenReturn(Optional.of(rutaMock));
        requestValido.setHoraFin(LocalTime.of(15, 0)); // 9 horas

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            turnoService.crearTurno(requestValido);
        });

        assertEquals("El turno no puede exceder las 8 horas", exception.getMessage());
        verify(turnoRepository, never()).save(any());
    }

    @Test
    void crearTurno_conMenosDe1Hora_debeLanzarExcepcion() {
        // Arrange
        when(rutaRepository.findById(1L)).thenReturn(Optional.of(rutaMock));
        requestValido.setHoraFin(LocalTime.of(6, 30)); // 30 minutos

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            turnoService.crearTurno(requestValido);
        });

        assertEquals("El turno debe ser de al menos 1 hora", exception.getMessage());
        verify(turnoRepository, never()).save(any());
    }

    @Test
    void obtenerTodosTurnos_debeRetornarListaDeTurnos() {
        // Arrange
        List<Turno> turnos = new ArrayList<>();
        turnos.add(turnoMock);
        when(turnoRepository.findAll()).thenReturn(turnos);
        when(turnoMapper.toDTO(any(Turno.class))).thenReturn(turnoDTOMock);
        when(asignacionTurnoRepository.findAsignacionActivaEnFecha(any(), any()))
                .thenReturn(Optional.empty());

        // Act
        List<TurnoDTO> resultado = turnoService.obtenerTodosTurnos();

        // Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        verify(turnoRepository, times(1)).findAll();
    }

    @Test
    void obtenerTurnoPorId_conIdValido_debeRetornarTurno() {
        // Arrange
        when(turnoRepository.findById(1L)).thenReturn(Optional.of(turnoMock));
        when(turnoMapper.toDTO(any(Turno.class))).thenReturn(turnoDTOMock);
        when(asignacionTurnoRepository.findAsignacionActivaEnFecha(any(), any()))
                .thenReturn(Optional.empty());

        // Act
        TurnoDTO resultado = turnoService.obtenerTurnoPorId(1L);

        // Assert
        assertNotNull(resultado);
        verify(turnoRepository, times(1)).findById(1L);
    }

    @Test
    void obtenerTurnoPorId_conIdInexistente_debeLanzarExcepcion() {
        // Arrange
        when(turnoRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            turnoService.obtenerTurnoPorId(999L);
        });

        assertEquals("Turno no encontrado", exception.getMessage());
    }

    @Test
    void eliminarTurno_sinAsignaciones_debeEliminarExitosamente() {
        // Arrange
        when(turnoRepository.findById(1L)).thenReturn(Optional.of(turnoMock));
        when(asignacionTurnoRepository.findByTurno(turnoMock)).thenReturn(new ArrayList<>());

        // Act
        turnoService.eliminarTurno(1L);

        // Assert
        verify(turnoRepository, times(1)).delete(turnoMock);
    }

    @Test
    void eliminarTurno_conAsignacionesActivas_debeLanzarExcepcion() {
        // Arrange
        List<AsignacionTurno> asignaciones = new ArrayList<>();
        asignaciones.add(new AsignacionTurno());

        when(turnoRepository.findById(1L)).thenReturn(Optional.of(turnoMock));
        when(asignacionTurnoRepository.findByTurno(turnoMock)).thenReturn(asignaciones);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            turnoService.eliminarTurno(1L);
        });

        assertEquals("No se puede eliminar un turno con asignaciones activas", exception.getMessage());
        verify(turnoRepository, never()).delete(any());
    }

    @Test
    void actualizarTurno_conDatosValidos_debeActualizarExitosamente() {
        // Arrange
        when(turnoRepository.findById(1L)).thenReturn(Optional.of(turnoMock));
        when(turnoRepository.save(any(Turno.class))).thenReturn(turnoMock);
        when(turnoMapper.toDTO(any(Turno.class))).thenReturn(turnoDTOMock);

        // Act
        TurnoDTO resultado = turnoService.actualizarTurno(1L, requestValido);

        // Assert
        assertNotNull(resultado);
        verify(turnoRepository, times(1)).save(any(Turno.class));
    }
}