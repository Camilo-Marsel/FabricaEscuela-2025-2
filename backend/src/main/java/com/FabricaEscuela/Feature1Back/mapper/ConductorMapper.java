package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.ConductorDTO;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ConductorMapper {

    @Mapping(source = "usuario.id", target = "usuarioId")
    @Mapping(source = "usuario.correo", target = "usuarioCorreo")
    @Mapping(source = "usuario.correo", target = "email") // ✅ Alias
    @Mapping(source = "usuario.correo", target = "correo")
    @Mapping(source = "usuario.rol", target = "usuarioRol")
    @Mapping(source = "nombreCompleto", target = "username") // ✅ Alias
    ConductorDTO toDTO(Conductor conductor);

    @Mapping(source = "usuarioId", target = "usuario.id")
    @Mapping(target = "usuario.correo", ignore = true)
    @Mapping(target = "usuario.password", ignore = true)
    @Mapping(target = "usuario.rol", ignore = true)
    @Mapping(target = "usuario.cedula", ignore = true)
    Conductor toEntity(ConductorDTO conductorDTO);
}





