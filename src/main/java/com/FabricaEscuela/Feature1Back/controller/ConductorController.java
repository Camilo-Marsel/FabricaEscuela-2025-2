package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.service.ConductorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*@RestController
@RequestMapping("/conductores")*/
@RestController
@RequestMapping("/api/conductores")
@CrossOrigin(origins = "*")
public class ConductorController {

    private final ConductorService conductorService;

    public ConductorController(ConductorService conductorService) {
        this.conductorService = conductorService;
    }

    @GetMapping
    public List<ConductorDTO> getAllConductores() {
        return conductorService.getAllConductores();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConductorDTO> getConductorById(@PathVariable Long id) {
        ConductorDTO conductor = conductorService.getConductorById(id);
        return conductor != null ? ResponseEntity.ok(conductor) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ConductorDTO createConductor(@RequestBody ConductorDTO dto) {
        return conductorService.createConductor(dto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConductorDTO> updateConductor(@PathVariable Long id, @RequestBody ConductorDTO dto) {
        ConductorDTO updated = conductorService.updateConductor(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConductor(@PathVariable Long id) {
        conductorService.deleteConductor(id);
        return ResponseEntity.noContent().build();
    }
}



