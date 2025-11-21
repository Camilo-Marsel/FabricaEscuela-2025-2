package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.AsignacionTurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.*;
import com.FabricaEscuela.Feature1Back.mapper.AsignacionTurnoMapper;
import com.FabricaEscuela.Feature1Back.mapper.TurnoMapper;
import com.FabricaEscuela.Feature1Back.repository.AsignacionTurnoRepository;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.TurnoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AsignacionTurnoService {

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;

    @Autowired
    private TurnoRepository turnoRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private AsignacionTurnoMapper asignacionTurnoMapper;

    @Transactional
    public AsignacionTurnoDTO asignarConductorATurno(AsignacionTurnoDTO dto) {
        // Validar que el turno existe
        Turno turno = turnoRepository.findById(dto.getTurnoId())
                .orElseThrow(() -> new RuntimeException("Turno no encontrado"));

        // Validar que el conductor existe
        Conductor conductor = conductorRepository.findById(dto.getConductorId())
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        // Verificar que el conductor no tenga otro turno en esa fecha/hora
        if (asignacionTurnoRepository.conductorTieneAsignacionEnFecha(conductor, dto.getFechaInicio())) {
            throw new RuntimeException("El conductor ya tiene un turno asignado en esa fecha");
        }

        // Crear la asignación
        AsignacionTurno asignacion = AsignacionTurno.builder()
                .turno(turno)
                .conductor(conductor)
                .fechaInicio(dto.getFechaInicio())
                .fechaFin(dto.getFechaFin())
                .estado(EstadoAsignacion.PROGRAMADA)
                .build();

        asignacion = asignacionTurnoRepository.save(asignacion);
        return enrichAsignacionDTO(asignacion);
    }

    public List<AsignacionTurnoDTO> obtenerTodasAsignaciones() {
        return asignacionTurnoRepository.findAll().stream()
                .map(this::enrichAsignacionDTO)
                .collect(Collectors.toList());
    }

    public List<AsignacionTurnoDTO> obtenerAsignacionesPorConductor(Long conductorId) {
        Conductor conductor = conductorRepository.findById(conductorId)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        return asignacionTurnoRepository.findByConductor(conductor).stream()
                .map(this::enrichAsignacionDTO)
                .collect(Collectors.toList());
    }

    public List<AsignacionTurnoDTO> obtenerAsignacionesActivas() {
        return asignacionTurnoRepository.findByEstado(EstadoAsignacion.EN_CURSO).stream()
                .map(this::enrichAsignacionDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AsignacionTurnoDTO iniciarTurno(Long asignacionId) {
        AsignacionTurno asignacion = asignacionTurnoRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));

        if (asignacion.getEstado() != EstadoAsignacion.PROGRAMADA) {
            throw new RuntimeException("Solo se pueden iniciar turnos en estado PROGRAMADA");
        }

        asignacion.setEstado(EstadoAsignacion.EN_CURSO);
        asignacion.setHoraInicioReal(LocalDateTime.now());

        asignacion = asignacionTurnoRepository.save(asignacion);
        return enrichAsignacionDTO(asignacion);
    }

    @Transactional
    public AsignacionTurnoDTO finalizarTurno(Long asignacionId) {
        AsignacionTurno asignacion = asignacionTurnoRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));

        if (asignacion.getEstado() != EstadoAsignacion.EN_CURSO) {
            throw new RuntimeException("Solo se pueden finalizar turnos en estado EN_CURSO");
        }

        asignacion.setEstado(EstadoAsignacion.FINALIZADA);
        asignacion.setHoraFinReal(LocalDateTime.now());

        asignacion = asignacionTurnoRepository.save(asignacion);
        return enrichAsignacionDTO(asignacion);
    }

    @Transactional
    public void cancelarAsignacion(Long asignacionId) {
        AsignacionTurno asignacion = asignacionTurnoRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada"));

        if (asignacion.getEstado() == EstadoAsignacion.FINALIZADA) {
            throw new RuntimeException("No se puede cancelar una asignación finalizada");
        }

        asignacion.setEstado(EstadoAsignacion.CANCELADA);
        asignacionTurnoRepository.save(asignacion);
    }

    // Método auxiliar para enriquecer el DTO
    private AsignacionTurnoDTO enrichAsignacionDTO(AsignacionTurno asignacion) {
        AsignacionTurnoDTO dto = asignacionTurnoMapper.toDTO(asignacion);

        // Agregar horario formateado
        String horario = String.format("%s - %s",
                asignacion.getTurno().getHoraInicio().toString(),
                asignacion.getTurno().getHoraFin().toString());
        dto.setHorarioTurno(horario);

        return dto;
    }

    @Autowired
    private TurnoMapper turnoMapper;

    /**
     * ⭐ NUEVO: Convertir AsignacionTurno a DTO con información completa
     */
    public AsignacionTurnoDTO toDTO(AsignacionTurno asignacion) {
        AsignacionTurnoDTO dto = asignacionTurnoMapper.toDTO(asignacion);

        // Enriquecer con información del turno y la ruta
        Turno turno = asignacion.getTurno();

        dto.setRutaNombre(turno.getRuta().getNombre());
        dto.setDiaSemanaNombre(turno.getDiaSemana().name());
        dto.setNumeroSemana(turno.getNumeroSemana());

        // Formatear horario: "06:00 - 14:00"
        String horario = String.format("%s - %s",
                turno.getHoraInicio().toString(),
                turno.getHoraFin().toString());
        dto.setHorarioTurno(horario);

        return dto;
    }
}