package com.FabricaEscuela.Feature1Back.mapper;

import com.FabricaEscuela.Feature1Back.DTO.UsuarioDTO;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsuarioMapper {

    UsuarioDTO toDTO(Usuario usuario);

    Usuario toEntity(UsuarioDTO dto);
}


