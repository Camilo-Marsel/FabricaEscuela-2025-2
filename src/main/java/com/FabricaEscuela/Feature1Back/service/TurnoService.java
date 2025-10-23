package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.CrearTurnoRequest;
import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.*;
import com.FabricaEscuela.Feature1Back.mapper.TurnoMapper;
import com.FabricaEscuela.Feature1Back.repository.AsignacionTurnoRepository;
import com.FabricaEscuela.Feature1Back.repository.RutaRepository;
import com.FabricaEscuela.Feature1Back.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TurnoService {

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private RutaRepository rutaRepository;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Autowired
    private TurnoMapper turnoMapper;

    @Transactional
    public TurnoDTO crearTurno(CrearTurnoRequest request) {
        // Validar que la ruta existe
        Ruta ruta = rutaRepository.findById(request.getRutaId())
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        // Validar que el turno no exceda 8 horas
        long duracionMinutos = Duration.between(request.getHoraInicio(), request.getHoraFin()).toMinutes();
        if (duracionMinutos > 480) { // 8 horas = 480 minutos
            throw new RuntimeException("El turno no puede exceder las 8 horas");
        }

        // Crear el turno
        Turno turno = Turno.builder()
                .ruta(ruta)
                .diaSemana(request.getDiaSemana())
                .horaInicio(request.getHoraInicio())
                .horaFin(request.getHoraFin())
                .duracionHoras((int) (duracionMinutos / 60))
                .numeroSemana(request.getNumeroSemana())
                .estado(EstadoTurno.ACTIVO)
                .build();

        turno = turnoRepository.save(turno);
        return turnoMapper.toDTO(turno);
    }

    public List<TurnoDTO> obtenerTodosTurnos() {
        return turnoRepository.findAll().stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTurnosPorRuta(Long rutaId) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        return turnoRepository.findByRuta(ruta).stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());
    }

    public List<TurnoDTO> obtenerTurnosPorRutaYSemana(Long rutaId, int numeroSemana) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        return turnoRepository.findByRutaAndNumeroSemana(ruta, numeroSemana).stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());
    }

    public TurnoDTO obtenerTurnoPorId(Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));
        return enrichTurnoDTO(turno);
    }

    @Transactional
    public TurnoDTO actualizarTurno(Long id, CrearTurnoRequest request) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        // Validar duración
        long duracionMinutos = Duration.between(request.getHoraInicio(), request.getHoraFin()).toMinutes();
        if (duracionMinutos > 480) {
            throw new RuntimeException("El turno no puede exceder las 8 horas");
        }

        turno.setDiaSemana(request.getDiaSemana());
        turno.setHoraInicio(request.getHoraInicio());
        turno.setHoraFin(request.getHoraFin());
        turno.setDuracionHoras((int) (duracionMinutos / 60));
        turno.setNumeroSemana(request.getNumeroSemana());

        turno = turnoRepository.save(turno);
        return turnoMapper.toDTO(turno);
    }

    @Transactional
    public void eliminarTurno(Long id) {
        Turno turno = turnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        // Verificar si tiene asignaciones activas
        List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findByTurno(turno);
        if (!asignaciones.isEmpty()) {
            throw new RuntimeException("No se puede eliminar un turno con asignaciones activas");
        }

        turnoRepository.delete(turno);
    }

    @Transactional
    public List<TurnoDTO> copiarSemanaTurnos(Long rutaId, int semanaOrigen, int semanaDestino) {
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        List<Turno> turnosOrigen = turnoRepository.findByRutaAndNumeroSemana(ruta, semanaOrigen);

        if (turnosOrigen.isEmpty()) {
            throw new RuntimeException("No hay turnos en la semana origen");
        }

        List<Turno> turnosDestino = turnosOrigen.stream()
                .map(turno -> Turno.builder()
                        .ruta(turno.getRuta())
                        .diaSemana(turno.getDiaSemana())
                        .horaInicio(turno.getHoraInicio())
                        .horaFin(turno.getHoraFin())
                        .duracionHoras(turno.getDuracionHoras())
                        .numeroSemana(semanaDestino)
                        .estado(turno.getEstado())
                        .build())
                .collect(Collectors.toList());

        turnosDestino = turnoRepository.saveAll(turnosDestino);

        return turnosDestino.stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());
    }

    // Método auxiliar para enriquecer el DTO con información de asignación
    private TurnoDTO enrichTurnoDTO(Turno turno) {
        TurnoDTO dto = turnoMapper.toDTO(turno);

        // Verificar si tiene asignación activa hoy
        LocalDate hoy = LocalDate.now();
        asignacionTurnoRepository.findAsignacionActivaEnFecha(turno, hoy)
                .ifPresent(asignacion -> {
                    dto.setTieneAsignacion(true);
                    dto.setConductorAsignado(asignacion.getConductor().getNombreCompleto());
                });

        return dto;
    }

    @Transactional
    public List<TurnoDTO> crearTurnosAutomaticos(Long rutaId, LocalTime horaInicio, LocalTime horaFin, int numeroSemana) {
        // Validar que la ruta existe
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        // Validar horarios
        if (horaInicio.isAfter(horaFin) || horaInicio.equals(horaFin)) {
            throw new RuntimeException("Horario inválido: inicio debe ser antes que fin");
        }

        List<Turno> turnosCreados = new ArrayList<>();

        // Días de la semana (Lunes a Domingo)
        DayOfWeek[] dias = {
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
        };

        // Para cada día de la semana
        for (DayOfWeek dia : dias) {
            LocalTime inicioTurno = horaInicio;

            // Dividir el día en turnos de máximo 8 horas
            while (inicioTurno.isBefore(horaFin)) {
                LocalTime finTurno = inicioTurno.plusHours(8);

                // Si el turno se pasaría del horario de fin, ajustarlo
                if (finTurno.isAfter(horaFin)) {
                    finTurno = horaFin;
                }

                // Calcular duración en minutos
                long duracionMinutos = Duration.between(inicioTurno, finTurno).toMinutes();

                // Validar que el turno tenga al menos 1 hora
                if (duracionMinutos < 60) {
                    break; // Salir del bucle si el turno es muy corto
                }

                int duracionHoras = (int) (duracionMinutos / 60);

                // Crear el turno
                Turno turno = Turno.builder()
                        .ruta(ruta)
                        .diaSemana(dia)
                        .horaInicio(inicioTurno)
                        .horaFin(finTurno)
                        .duracionHoras(duracionHoras)
                        .numeroSemana(numeroSemana)
                        .estado(EstadoTurno.ACTIVO)
                        .build();

                turnosCreados.add(turno);

                // ⚠️ CRÍTICO: Avanzar al siguiente turno
                inicioTurno = finTurno;

                // Seguridad: Si inicioTurno alcanzó o superó horaFin, salir
                if (!inicioTurno.isBefore(horaFin)) {
                    break;
                }
            }
        }

        // Validar que se crearon turnos
        if (turnosCreados.isEmpty()) {
            throw new RuntimeException("No se pudieron crear turnos con el horario especificado");
        }

        // Guardar todos los turnos
        turnosCreados = turnoRepository.saveAll(turnosCreados);

        return turnosCreados.stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());
    }
}