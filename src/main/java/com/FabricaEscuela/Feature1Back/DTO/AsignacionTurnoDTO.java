package com.FabricaEscuela.Feature1Back.DTO;

import com.FabricaEscuela.Feature1Back.entity.EstadoAsignacion;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignacionTurnoDTO {

    private Long id;

    @NotNull(message = "El turno es obligatorio")
    private Long turnoId;

    @NotNull(message = "El conductor es obligatorio")
    private Long conductorId;

    @NotNull(message = "La fecha de inicio es obligatoria")
    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @NotNull(message = "El estado es obligatorio")
    private EstadoAsignacion estado;

    private LocalDateTime horaInicioReal;

    private LocalDateTime horaFinReal;

    // Campos adicionales para respuestas
    private String conductorNombre;
    private String rutaNombre;
    private String diaSemanaNombre;
    private String horarioTurno; // Ej: "06:00 - 14:00"
    private Integer numeroSemana;
}