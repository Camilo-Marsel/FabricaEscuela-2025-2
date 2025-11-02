package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.UsuarioDTO;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import com.FabricaEscuela.Feature1Back.mapper.UsuarioMapper;
import com.FabricaEscuela.Feature1Back.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final UsuarioMapper usuarioMapper;

    public UsuarioService(UsuarioRepository usuarioRepository, UsuarioMapper usuarioMapper) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioMapper = usuarioMapper;
    }

    public List<UsuarioDTO> getAllUsuarios() {
        return usuarioRepository.findAll()
                .stream()
                .map(usuarioMapper::toDTO)
                .toList();
    }

    public UsuarioDTO getUsuarioById(Long id) {
        return usuarioRepository.findById(id)
                .map(usuarioMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public UsuarioDTO createUsuario(UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioMapper.toEntity(usuarioDTO);
        return usuarioMapper.toDTO(usuarioRepository.save(usuario));
    }

    public UsuarioDTO updateUsuario(Long id, UsuarioDTO usuarioDTO) {
        Usuario existente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        existente.setCorreo(usuarioDTO.getCorreo()); // Asumiendo que UsuarioDTO tiene getCorreo()
        existente.setRol(usuarioDTO.getRol());       // Asumiendo que UsuarioDTO tiene getRol()

        return usuarioMapper.toDTO(usuarioRepository.save(existente));
    }

    public void deleteUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }
}