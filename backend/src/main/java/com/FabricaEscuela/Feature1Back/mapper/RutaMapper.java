package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.RutaDTO;
import com.FabricaEscuela.Feature1Back.entity.Ruta;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RutaMapper {

    public Ruta toEntity(RutaDTO dto) {
        if (dto == null) return null;
        Ruta ruta = new Ruta();
        // NO mapear ID aquí - se genera automáticamente
        ruta.setNombre(dto.getNombre());
        ruta.setOrigen(dto.getOrigen());
        ruta.setDestino(dto.getDestino());
        ruta.setDuracionEnMinutos(dto.getDuracionEnMinutos());
        return ruta;
    }
//de prueba
public RutaDTO toDTO(Ruta ruta) {
    if (ruta == null) return null;

    RutaDTO dto = new RutaDTO();
    dto.setId(ruta.getId());
    dto.setNombre(ruta.getNombre());
    dto.setOrigen(ruta.getOrigen());
    dto.setDestino(ruta.getDestino());
    dto.setDuracionEnMinutos(ruta.getDuracionEnMinutos());

    // ⭐ Opcional: Agregar código y descripción generados
    dto.setCodigo(String.format("R%03d", ruta.getId()));
    dto.setDescription(ruta.getOrigen() + " - " + ruta.getDestino());

    return dto;
    }

    public List<RutaDTO> toDTOList(List<Ruta> rutas) {
        return rutas.stream().map(this::toDTO).toList();
    }
}