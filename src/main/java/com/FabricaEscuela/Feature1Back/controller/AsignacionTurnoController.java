package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.AsignacionTurnoDTO;
import com.FabricaEscuela.Feature1Back.service.AsignacionTurnoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}