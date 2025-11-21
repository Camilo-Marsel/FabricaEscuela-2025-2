// backend/src/main/java/com/FabricaEscuela/Feature1Back/controller/TurnoController.java
package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.DTO.CrearTurnoRequest;
import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.mapper.ConductorMapper;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import com.FabricaEscuela.Feature1Back.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import java.util.Map;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {
    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private ConductorMapper conductorMapper;

    @Autowired
    private UsuarioRepository usuarioRepository;  // ⭐ AGREGAR si no está
    @Autowired
    private TurnoService turnoService;

    @PostMapping
    public ResponseEntity<TurnoDTO> crearTurno(@Valid @RequestBody CrearTurnoRequest request) {
        try {
            TurnoDTO turno = turnoService.crearTurno(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(turno);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<TurnoDTO>> obtenerTodosTurnos() {
        List<TurnoDTO> turnos = turnoService.obtenerTodosTurnos();
        return ResponseEntity.ok(turnos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TurnoDTO> obtenerTurnoPorId(@PathVariable Long id) {
        try {
            TurnoDTO turno = turnoService.obtenerTurnoPorId(id);
            return ResponseEntity.ok(turno);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ruta/{rutaId}")
    public ResponseEntity<List<TurnoDTO>> obtenerTurnosPorRuta(@PathVariable Long rutaId) {
        try {
            List<TurnoDTO> turnos = turnoService.obtenerTurnosPorRuta(rutaId);
            return ResponseEntity.ok(turnos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/ruta/{rutaId}/semana/{numeroSemana}")
    public ResponseEntity<List<TurnoDTO>> obtenerTurnosPorRutaYSemana(
            @PathVariable Long rutaId,
            @PathVariable int numeroSemana) {
        try {
            List<TurnoDTO> turnos = turnoService.obtenerTurnosPorRutaYSemana(rutaId, numeroSemana);
            return ResponseEntity.ok(turnos);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TurnoDTO> actualizarTurno(
            @PathVariable Long id,
            @Valid @RequestBody CrearTurnoRequest request) {
        try {
            TurnoDTO turno = turnoService.actualizarTurno(id, request);
            return ResponseEntity.ok(turno);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarTurno(@PathVariable Long id) {
        try {
            turnoService.eliminarTurno(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * ⭐ NUEVO: Previsualizar turnos automáticos sin crearlos
     */
    @GetMapping("/previsualizar")
    public ResponseEntity<?> previsualizarTurnosAutomaticos(
            @RequestParam Long rutaId,
            @RequestParam(required = false) String horaInicio,
            @RequestParam(required = false) String horaFin,
            @RequestParam(defaultValue = "1") int numeroSemana) {
        try {
            // Si no se especifican horarios, usar horario estándar (6 AM - 10 PM)
            LocalTime inicio = horaInicio != null ? LocalTime.parse(horaInicio) : LocalTime.of(6, 0);
            LocalTime fin = horaFin != null ? LocalTime.parse(horaFin) : LocalTime.of(22, 0);

            Map<String, Object> previsualizacion = turnoService.previsualizarTurnosAutomaticos(
                    rutaId, inicio, fin, numeroSemana
            );

            return ResponseEntity.ok(previsualizacion);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    /**
     * ⭐ MEJORADO: Crear turnos automáticos (solo turnos completos de 8h)
     */
    @PostMapping("/auto")
    public ResponseEntity<?> crearTurnosAutomaticos(
            @RequestParam Long rutaId,
            @RequestParam(required = false) String horaInicio,
            @RequestParam(required = false) String horaFin,
            @RequestParam(defaultValue = "1") int numeroSemana) {
        try {
            // Si no se especifican horarios, usar horario estándar (6 AM - 10 PM)
            LocalTime inicio = horaInicio != null ? LocalTime.parse(horaInicio) : LocalTime.of(6, 0);
            LocalTime fin = horaFin != null ? LocalTime.parse(horaFin) : LocalTime.of(22, 0);

            List<TurnoDTO> turnos = turnoService.crearTurnosAutomaticos(rutaId, inicio, fin, numeroSemana);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Se crearon " + turnos.size() + " turnos automáticamente",
                    "totalTurnos", turnos.size(),
                    "turnosPorDia", turnos.size() / 7,
                    "turnos", turnos
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/copiar-semana")
    public ResponseEntity<List<TurnoDTO>> copiarSemanaTurnos(
            @RequestParam Long rutaId,
            @RequestParam int semanaOrigen,
            @RequestParam int semanaDestino) {
        try {
            List<TurnoDTO> turnos = turnoService.copiarSemanaTurnos(rutaId, semanaOrigen, semanaDestino);
            return ResponseEntity.ok(turnos);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }


    /**
     * ⭐ NUEVO: Obtener información del conductor logueado
     */
    @GetMapping("/me")
    public ResponseEntity<?> getMiInformacion() {
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

            // Convertir a DTO
            ConductorDTO dto = conductorMapper.toDTO(conductor);

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}