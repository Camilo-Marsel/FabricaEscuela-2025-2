package com.FabricaEscuela.Feature1Back.repository;

import com.FabricaEscuela.Feature1Back.entity.AsignacionTurno;
import com.FabricaEscuela.Feature1Back.entity.Conductor;
import com.FabricaEscuela.Feature1Back.entity.EstadoAsignacion;
import com.FabricaEscuela.Feature1Back.entity.Turno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AsignacionTurnoRepository extends JpaRepository<AsignacionTurno, Long> {

    // Buscar asignaciones de un turno específico
    List<AsignacionTurno> findByTurno(Turno turno);

    // Buscar asignaciones de un conductor
    List<AsignacionTurno> findByConductor(Conductor conductor);

    // Buscar asignaciones activas de un conductor
    List<AsignacionTurno> findByConductorAndEstado(Conductor conductor, EstadoAsignacion estado);

    // Buscar asignación activa de un turno en una fecha específica
    @Query("SELECT a FROM AsignacionTurno a WHERE a.turno = :turno " +
            "AND a.fechaInicio <= :fecha " +
            "AND (a.fechaFin IS NULL OR a.fechaFin >= :fecha) " +
            "AND a.estado != 'CANCELADA'")
    Optional<AsignacionTurno> findAsignacionActivaEnFecha(
            @Param("turno") Turno turno,
            @Param("fecha") LocalDate fecha
    );

    // Buscar todas las asignaciones EN_CURSO (turnos activos ahora)
    List<AsignacionTurno> findByEstado(EstadoAsignacion estado);

    Optional<AsignacionTurno> findByConductorAndFechaInicio(Conductor conductor, LocalDate fechaInicio);

    // Verificar si un conductor tiene un turno asignado en una fecha específica
    @Query("SELECT COUNT(a) > 0 FROM AsignacionTurno a WHERE a.conductor = :conductor " +
            "AND a.fechaInicio <= :fecha " +
            "AND (a.fechaFin IS NULL OR a.fechaFin >= :fecha) " +
            "AND a.estado != 'CANCELADA'")
    boolean conductorTieneAsignacionEnFecha(
            @Param("conductor") Conductor conductor,
            @Param("fecha") LocalDate fecha
    );
}