package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ConductorMapper {
    ConductorDTO toDTO(Conductor conductor);
    Conductor toEntity(ConductorDTO dto);
}





