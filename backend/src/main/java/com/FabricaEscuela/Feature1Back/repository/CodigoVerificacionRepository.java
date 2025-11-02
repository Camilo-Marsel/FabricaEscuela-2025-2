package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.CodigoVerificacion;
import com.FabricaEscuela.Feature1Back.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CodigoVerificacionRepository extends JpaRepository<CodigoVerificacion, Long> {

    Optional<CodigoVerificacion> findByCodigoAndUsuarioAndUsadoFalse(String codigo, Usuario usuario);

    void deleteByUsuario(Usuario usuario);
}