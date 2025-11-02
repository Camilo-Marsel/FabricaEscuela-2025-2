package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.AsignacionTurnoDTO;
import com.FabricaEscuela.Feature1Back.entity.AsignacionTurno;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AsignacionTurnoMapper {

    @Mapping(source = "turno.id", target = "turnoId")
    @Mapping(source = "conductor.id", target = "conductorId")
    @Mapping(source = "conductor.nombreCompleto", target = "conductorNombre")
    @Mapping(source = "turno.ruta.nombre", target = "rutaNombre")
    @Mapping(source = "turno.diaSemana", target = "diaSemanaNombre")
    @Mapping(source = "turno.numeroSemana", target = "numeroSemana")
    @Mapping(target = "horarioTurno", ignore = true)
    AsignacionTurnoDTO toDTO(AsignacionTurno asignacionTurno);

    @Mapping(source = "turnoId", target = "turno.id")
    @Mapping(source = "conductorId", target = "conductor.id")
    @Mapping(target = "turno.ruta", ignore = true)
    @Mapping(target = "turno.diaSemana", ignore = true)
    @Mapping(target = "turno.horaInicio", ignore = true)
    @Mapping(target = "turno.horaFin", ignore = true)
    @Mapping(target = "turno.duracionHoras", ignore = true)
    @Mapping(target = "turno.numeroSemana", ignore = true)
    @Mapping(target = "turno.estado", ignore = true)
    @Mapping(target = "conductor.nombreCompleto", ignore = true)
    @Mapping(target = "conductor.licencia", ignore = true)
    @Mapping(target = "conductor.telefono", ignore = true)
    @Mapping(target = "conductor.usuario", ignore = true)
    AsignacionTurno toEntity(AsignacionTurnoDTO asignacionTurnoDTO);
}