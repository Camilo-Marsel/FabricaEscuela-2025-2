package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.entity.Rol;
import com.FabricaEscuela.Feature1Back.mapper.ConductorMapper;
import com.FabricaEscuela.Feature1Back.repository.ConductorRepository;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConductorService {

    private final ConductorRepository conductorRepository;
    private final UsuarioRepository usuarioRepository;
    private final ConductorMapper conductorMapper;

    public ConductorService(ConductorRepository conductorRepository,
                            UsuarioRepository usuarioRepository,
                            ConductorMapper conductorMapper) {
        this.conductorRepository = conductorRepository;
        this.usuarioRepository = usuarioRepository;
        this.conductorMapper = conductorMapper;
    }
    public List<ConductorDTO> getAllConductores() {
        return conductorRepository.findAll()
                .stream()
                .map(conductorMapper::toDTO)
                .toList();
    }

    public ConductorDTO getConductorById(Long id) {
        return conductorRepository.findById(id)
                .map(conductorMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));
    }

    public ConductorDTO createConductor(ConductorDTO dto) {
        Usuario usuario = usuarioRepository.findById(dto.getUsuario().getId())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.CONDUCTOR) {
            throw new RuntimeException("El usuario no tiene rol CONDUCTOR");
        }

        Conductor conductor = conductorMapper.toEntity(dto);
        conductor.setUsuario(usuario);

        return conductorMapper.toDTO(conductorRepository.save(conductor));
    }

    public ConductorDTO updateConductor(Long id, ConductorDTO dto) {
        Conductor existente = conductorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conductor no encontrado"));

        existente.setLicencia(dto.getLicencia());
        existente.setNombreCompleto(dto.getNombreCompleto());
        existente.setTelefono(dto.getTelefono());
        // Usuario normalmente no se cambia

        return conductorMapper.toDTO(conductorRepository.save(existente));
    }

    public void deleteConductor(Long id) {
        if (!conductorRepository.existsById(id)) {
            throw new RuntimeException("Conductor no encontrado");
        }
        conductorRepository.deleteById(id);
    }
}
