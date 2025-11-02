package com.FabricaEscuela.Feature1Back.service;

import com.FabricaEscuela.Feature1Back.DTO.RutaDTO;
import com.FabricaEscuela.Feature1Back.entity.Ruta;
import com.FabricaEscuela.Feature1Back.mapper.RutaMapper;
import com.FabricaEscuela.Feature1Back.repository.RutaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RutaService {

    private final RutaRepository rutaRepository;
    private final RutaMapper rutaMapper;

    public RutaService(RutaRepository rutaRepository, RutaMapper rutaMapper) {
        this.rutaRepository = rutaRepository;
        this.rutaMapper = rutaMapper;
    }

    public RutaDTO createRuta(RutaDTO dto) {
        Ruta ruta = rutaMapper.toEntity(dto);
        Ruta saved = rutaRepository.save(ruta);
        return rutaMapper.toDTO(saved);
    }

    public List<RutaDTO> getAllRutas() {
        return rutaMapper.toDTOList(rutaRepository.findAll());
    }

    public Optional<RutaDTO> getRutaById(Long id) {
        return rutaRepository.findById(id).map(rutaMapper::toDTO);
    }

    public boolean deleteRuta(Long id) {
        if (rutaRepository.existsById(id)) {
            rutaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Método auxiliar para enriquecer el DTO
    private RutaDTO enrichRutaDTO(Ruta ruta) {
        RutaDTO dto = rutaMapper.toDTO(ruta);

        // Generar código formateado
        dto.setCodigo(String.format("R%03d", ruta.getId()));

        // Generar descripción
        dto.setDescription(String.format("De %s a %s (%d min)",
                ruta.getOrigen(),
                ruta.getDestino(),
                ruta.getDuracionEnMinutos()));

        return dto;
    }
}


