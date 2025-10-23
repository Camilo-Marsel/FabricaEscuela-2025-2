package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.Ruta;
import com.FabricaEscuela.Feature1Back.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface TurnoRepository extends JpaRepository<Turno, Long> {

    // Buscar todos los turnos de una ruta
    List<Turno> findByRuta(Ruta ruta);

    // Buscar turnos de una ruta en una semana específica
    List<Turno> findByRutaAndNumeroSemana(Ruta ruta, int numeroSemana);

    // Buscar turnos de una ruta en un día específico
    List<Turno> findByRutaAndDiaSemana(Ruta ruta, DayOfWeek diaSemana);

    // Buscar turnos de una ruta, día y semana específicos
    List<Turno> findByRutaAndDiaSemanaAndNumeroSemana(Ruta ruta, DayOfWeek diaSemana, int numeroSemana);
}