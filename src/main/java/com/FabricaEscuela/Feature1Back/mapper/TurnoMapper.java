package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.TurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.Turno;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TurnoMapper {

    @Mapping(source = "ruta.id", target = "rutaId")
    @Mapping(source = "ruta.nombre", target = "rutaNombre")
    @Mapping(target = "tieneAsignacion", ignore = true)
    @Mapping(target = "conductorAsignado", ignore = true)
    TurnoDTO toDTO(Turno turno);

    @Mapping(source = "rutaId", target = "ruta.id")
    @Mapping(target = "ruta.nombre", ignore = true)
    @Mapping(target = "ruta.origen", ignore = true)
    @Mapping(target = "ruta.destino", ignore = true)
    @Mapping(target = "ruta.duracionEnMinutos", ignore = true)
    @Mapping(target = "ruta.conductores", ignore = true)
    Turno toEntity(TurnoDTO turnoDTO);
}