package com.FabricaEscuela.Feature1Back.controller;

import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.mapper.ConductorMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.Map;
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



    // ⭐ AGREGAR ESTAS INYECCIONES:
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ConductorRepository conductorRepository;

    @Autowired
    private ConductorMapper conductorMapper;
    /**
     * NUEVO: Obtener información del conductor logueado
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



