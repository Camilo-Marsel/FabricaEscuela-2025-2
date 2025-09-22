package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.Conductor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConductorRepository extends JpaRepository<Conductor, Long> {
}
