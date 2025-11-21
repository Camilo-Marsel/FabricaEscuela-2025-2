// backend/src/main/java/com/FabricaEscuela/Feature1Back/service/TurnoService.java
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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

        if (duracionMinutos < 60) { // Mínimo 1 hora
            throw new RuntimeException("El turno debe ser de al menos 1 hora");
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

        if (duracionMinutos < 60) {
            throw new RuntimeException("El turno debe ser de al menos 1 hora");
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

    /**
     * ⭐ NUEVO: Previsualización de turnos automáticos
     * Calcula los turnos que se crearían sin guardarlos
     */
    public Map<String, Object> previsualizarTurnosAutomaticos(
            Long rutaId,
            LocalTime horaInicio,
            LocalTime horaFin,
            int numeroSemana) {

        // Validar que la ruta existe
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        // Validar horarios
        if (horaInicio.isAfter(horaFin) || horaInicio.equals(horaFin)) {
            throw new RuntimeException("Horario inválido: inicio debe ser antes que fin");
        }

        List<Map<String, Object>> turnosPrevisualizados = new ArrayList<>();
        int totalMinutos = (int) Duration.between(horaInicio, horaFin).toMinutes();
        int turnosPorDia = totalMinutos / 480; // Turnos completos de 8 horas
        int minutosRestantes = totalMinutos % 480;

        // Calcular turnos para un día
        LocalTime inicioTurno = horaInicio;
        for (int i = 0; i < turnosPorDia; i++) {
            LocalTime finTurno = inicioTurno.plusHours(8);

            Map<String, Object> turno = new HashMap<>();
            turno.put("horaInicio", inicioTurno.toString());
            turno.put("horaFin", finTurno.toString());
            turno.put("duracionHoras", 8);

            turnosPrevisualizados.add(turno);
            inicioTurno = finTurno;
        }

        // Preparar respuesta
        Map<String, Object> resultado = new HashMap<>();
        resultado.put("rutaNombre", ruta.getNombre());
        resultado.put("horaInicio", horaInicio.toString());
        resultado.put("horaFin", horaFin.toString());
        resultado.put("turnosPorDia", turnosPorDia);
        resultado.put("totalTurnos", turnosPorDia * 7); // 7 días
        resultado.put("turnosMuestra", turnosPrevisualizados);

        if (minutosRestantes > 0) {
            resultado.put("minutosRestantes", minutosRestantes);
            resultado.put("horasRestantes", minutosRestantes / 60.0);
            resultado.put("advertencia", String.format(
                    "Quedarán %d minutos sin cubrir (%02d:%02d - %s). " +
                            "Ajusta el horario de fin a %s para crear solo turnos completos.",
                    minutosRestantes,
                    inicioTurno.getHour(),
                    inicioTurno.getMinute(),
                    horaFin.toString(),
                    inicioTurno.toString()
            ));
        }

        return resultado;
    }

    /**
     * ⭐ MEJORADO: Crear turnos automáticos con lógica optimizada
     * Solo crea turnos completos de 8 horas
     */
    @Transactional
    public List<TurnoDTO> crearTurnosAutomaticos(
            Long rutaId,
            LocalTime horaInicio,
            LocalTime horaFin,
            int numeroSemana) {

        System.out.println("⏱️ INICIO - crearTurnosAutomaticos");
        long startTime = System.currentTimeMillis();

        // Validar que la ruta existe
        Ruta ruta = rutaRepository.findById(rutaId)
                .orElseThrow(() -> new RuntimeException("Ruta no encontrada"));

        System.out.println("⏱️ Ruta cargada: " + (System.currentTimeMillis() - startTime) + "ms");

        // Validar horarios
        if (horaInicio.isAfter(horaFin) || horaInicio.equals(horaFin)) {
            throw new RuntimeException("Horario inválido: inicio debe ser antes que fin");
        }

        List<Turno> turnosCreados = new ArrayList<>();

        // Días de la semana
        DayOfWeek[] dias = {
                DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY,
                DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY
        };

        // Para cada día de la semana
        for (DayOfWeek dia : dias) {
            LocalTime inicioTurno = horaInicio;

            while (inicioTurno.plusHours(8).isBefore(horaFin) ||
                    inicioTurno.plusHours(8).equals(horaFin)) {

                LocalTime finTurno = inicioTurno.plusHours(8);

                Turno turno = Turno.builder()
                        .ruta(ruta)
                        .diaSemana(dia)
                        .horaInicio(inicioTurno)
                        .horaFin(finTurno)
                        .duracionHoras(8)
                        .numeroSemana(numeroSemana)
                        .estado(EstadoTurno.ACTIVO)
                        .build();

                turnosCreados.add(turno);
                inicioTurno = finTurno;
                if (finTurno.equals(horaFin)) {
                    break;  // ← CRÍTICO
                }
            }
        }

        System.out.println("⏱️ Turnos construidos en memoria: " + (System.currentTimeMillis() - startTime) + "ms");
        System.out.println("⏱️ Total turnos a guardar: " + turnosCreados.size());

        if (turnosCreados.isEmpty()) {
            throw new RuntimeException(
                    "No se pueden crear turnos: el rango horario debe permitir " +
                            "al menos un turno completo de 8 horas"
            );
        }

        // Guardar todos los turnos
        turnosCreados = turnoRepository.saveAll(turnosCreados);

        System.out.println("⏱️ Turnos guardados en BD: " + (System.currentTimeMillis() - startTime) + "ms");

        // ⚠️ AQUÍ PUEDE ESTAR EL PROBLEMA - enrichTurnoDTO hace consultas adicionales
        List<TurnoDTO> resultado = turnosCreados.stream()
                .map(this::enrichTurnoDTO)
                .collect(Collectors.toList());

        System.out.println("⏱️ DTOs enriquecidos: " + (System.currentTimeMillis() - startTime) + "ms");
        System.out.println("⏱️ TOTAL: " + (System.currentTimeMillis() - startTime) + "ms");

        return resultado;
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
}