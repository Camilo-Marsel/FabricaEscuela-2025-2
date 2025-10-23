package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.DTO.RutaDTO;
import com.FabricaEscuela.Feature1Back.service.RutaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
/*@RequestMapping("/rutas")*/
@RequestMapping("/api/rutas")
@CrossOrigin(origins = "*")
public class RutaController {

    private final RutaService rutaService;

    public RutaController(RutaService rutaService) {
        this.rutaService = rutaService;
    }

    @PostMapping
    public RutaDTO createRuta(@RequestBody RutaDTO dto) {
        return rutaService.createRuta(dto); // Usar el método correcto del service
    }

    @GetMapping
    public List<RutaDTO> getAllRutas() {
        return rutaService.getAllRutas(); // Devuelve DTOs, no entidades
    }

    @GetMapping("/{id}")
    public ResponseEntity<RutaDTO> getRutaById(@PathVariable Long id) {
        return rutaService.getRutaById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRuta(@PathVariable Long id) {
        return rutaService.deleteRuta(id) ?
                ResponseEntity.noContent().build() :
                ResponseEntity.notFound().build();
    }
}