package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.CrearTurnoRequest;
import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.service.TurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/turnos")
@CrossOrigin(origins = "*")
public class TurnoController {

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

    @PostMapping("/auto")
    public ResponseEntity<?> crearTurnosAutomaticos(
            @RequestParam Long rutaId,
            @RequestParam(required = false) String horaInicio,
            @RequestParam(required = false) String horaFin,
            @RequestParam(defaultValue = "1") int numeroSemana) {
        try {
            // Si no se especifican horarios, usar horario estándar (5 AM - 11 PM)
            LocalTime inicio = horaInicio != null ? LocalTime.parse(horaInicio) : LocalTime.of(5, 0);
            LocalTime fin = horaFin != null ? LocalTime.parse(horaFin) : LocalTime.of(23, 0);

            List<TurnoDTO> turnos = turnoService.crearTurnosAutomaticos(rutaId, inicio, fin, numeroSemana);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Se crearon " + turnos.size() + " turnos automáticamente",
                    "turnos", turnos
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}