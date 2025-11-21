package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.AsignacionTurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.AsignacionTurno;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.EstadoAsignacion;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.mapper.AsignacionTurnoMapper;
import com.FabricaEscuela.Feature1Back.repository.AsignacionTurnoRepository;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import com.FabricaEscuela.Feature1Back.service.AsignacionTurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionTurnoController {

    @Autowired
    private AsignacionTurnoService asignacionTurnoService;

    @PostMapping
    public ResponseEntity<AsignacionTurnoDTO> asignarConductorATurno(
            @Valid @RequestBody AsignacionTurnoDTO dto) {
        try {
            AsignacionTurnoDTO asignacion = asignacionTurnoService.asignarConductorATurno(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(asignacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerTodasAsignaciones() {
        List<AsignacionTurnoDTO> asignaciones = asignacionTurnoService.obtenerTodasAsignaciones();
        return ResponseEntity.ok(asignaciones);
    }

    @GetMapping("/conductor/{conductorId}")
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerAsignacionesPorConductor(
            @PathVariable Long conductorId) {
        try {
            List<AsignacionTurnoDTO> asignaciones =
                    asignacionTurnoService.obtenerAsignacionesPorConductor(conductorId);
            return ResponseEntity.ok(asignaciones);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/activas")
    public ResponseEntity<List<AsignacionTurnoDTO>> obtenerAsignacionesActivas() {
        List<AsignacionTurnoDTO> asignaciones = asignacionTurnoService.obtenerAsignacionesActivas();
        return ResponseEntity.ok(asignaciones);
    }

    @PatchMapping("/{id}/iniciar")
    public ResponseEntity<AsignacionTurnoDTO> iniciarTurno(@PathVariable Long id) {
        try {
            AsignacionTurnoDTO asignacion = asignacionTurnoService.iniciarTurno(id);
            return ResponseEntity.ok(asignacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PatchMapping("/{id}/finalizar")
    public ResponseEntity<AsignacionTurnoDTO> finalizarTurno(@PathVariable Long id) {
        try {
            AsignacionTurnoDTO asignacion = asignacionTurnoService.finalizarTurno(id);
            return ResponseEntity.ok(asignacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelarAsignacion(@PathVariable Long id) {
        try {
            asignacionTurnoService.cancelarAsignacion(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private AsignacionTurnoMapper asignacionTurnoMapper;

    @Autowired
    private AsignacionTurnoRepository asignacionTurnoRepository;  // ⭐ FALTABA ESTE

    /**
     * ⭐ NUEVO: Obtener turno actual del conductor (HOY)
     */
    @GetMapping("/conductor/me/actual")
    public ResponseEntity<?> getMiTurnoActual() {
        try {
            // Obtener correo del conductor desde el JWT
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String correo = auth.getName();

            // Buscar usuario por correo
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Buscar conductor por cédula del usuario
            Conductor conductor = conductorRepository.findByCedula(usuario.getCedula())
                    .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

            // ⭐ CORREGIDO: Usar asignacionTurnoRepository (no mapper)
            List<AsignacionTurno> asignaciones = asignacionTurnoRepository.findByConductor(conductor);

            // Filtrar turno de hoy manualmente
            LocalDate hoy = LocalDate.now();
            DayOfWeek diaHoy = hoy.getDayOfWeek();

            Optional<AsignacionTurno> asignacionHoy = asignaciones.stream()
                    .filter(a -> a.getTurno().getDiaSemana() == diaHoy)
                    .filter(a -> a.getFechaInicio().isBefore(hoy.plusDays(1)))
                    .filter(a -> a.getFechaFin() == null || a.getFechaFin().isAfter(hoy.minusDays(1)))
                    .filter(a -> a.getEstado() != EstadoAsignacion.CANCELADA)
                    .findFirst();

            if (asignacionHoy.isEmpty()) {
                return ResponseEntity.ok(Map.of(
                        "mensaje", "No tienes turno asignado para hoy",
                        "tieneAsignacion", false
                ));
            }

            // ⭐ CORREGIDO: Llamar al mapper como instancia (no estático)
            AsignacionTurnoDTO dto = asignacionTurnoService.toDTO(asignacionHoy.get());

            return ResponseEntity.ok(Map.of(
                    "tieneAsignacion", true,
                    "asignacion", dto
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * ⭐ NUEVO: Obtener próximos turnos del conductor (7 días)
     */
    @GetMapping("/conductor/me/proximos")
    public ResponseEntity<?> getMisProximosTurnos() {
        try {
            // Obtener correo del conductor desde el JWT
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String correo = auth.getName();

            // Buscar usuario por correo
            Usuario usuario = usuarioRepository.findByCorreo(correo)
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            // Buscar conductor por cédula del usuario
            Conductor conductor = conductorRepository.findByCedula(usuario.getCedula())
                    .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

            // Obtener todas las asignaciones del conductor
            List<AsignacionTurno> todasAsignaciones = asignacionTurnoRepository.findByConductor(conductor);

            // Filtrar asignaciones futuras (próximos 7 días)
            LocalDate hoy = LocalDate.now();
            LocalDate finSemana = hoy.plusDays(7);

            List<AsignacionTurno> asignacionesFuturas = todasAsignaciones.stream()
                    .filter(a -> a.getFechaInicio().isAfter(hoy))
                    .filter(a -> a.getFechaInicio().isBefore(finSemana.plusDays(1)))
                    .filter(a -> a.getEstado() != EstadoAsignacion.CANCELADA)
                    .collect(Collectors.toList());

            // ⭐ CORREGIDO: Llamar al mapper como instancia (no estático)
            List<AsignacionTurnoDTO> dtos = asignacionesFuturas.stream()
                    .map(asignacionTurnoService::toDTO)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}