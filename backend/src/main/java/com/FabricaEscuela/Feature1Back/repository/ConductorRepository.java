package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface ConductorRepository extends JpaRepository<Conductor, Long> {
    Optional<Conductor> findByCedula(String cedula);
}
