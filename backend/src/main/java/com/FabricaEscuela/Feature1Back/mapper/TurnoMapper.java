package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.Turno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TurnoMapper {

    @Autowired
    private RutaMapper rutaMapper;  // ← Inyectar RutaMapper

    public TurnoDTO toDTO(Turno turno) {
        if (turno == null) {
            return null;
        }

        return TurnoDTO.builder()
                .id(turno.getId())
                // ⭐ MAPEAR OBJETO COMPLETO DE RUTA usando RutaMapper
                .ruta(rutaMapper.toDTO(turno.getRuta()))
                .diaSemana(turno.getDiaSemana())
                .horaInicio(turno.getHoraInicio())
                .horaFin(turno.getHoraFin())
                .duracionHoras(turno.getDuracionHoras())
                .numeroSemana(turno.getNumeroSemana())
                .estado(turno.getEstado())
                .tieneAsignacion(false)  // Se establece en el servicio
                .conductorAsignado(null) // Se establece en el servicio
                .build();
    }

    public Turno toEntity(TurnoDTO dto) {
        if (dto == null) {
            return null;
        }

        return Turno.builder()
                .id(dto.getId())
                // La ruta se establece por separado en el servicio
                .diaSemana(dto.getDiaSemana())
                .horaInicio(dto.getHoraInicio())
                .horaFin(dto.getHoraFin())
                .duracionHoras(dto.getDuracionHoras())
                .numeroSemana(dto.getNumeroSemana())
                .estado(dto.getEstado())
                .build();
    }
}