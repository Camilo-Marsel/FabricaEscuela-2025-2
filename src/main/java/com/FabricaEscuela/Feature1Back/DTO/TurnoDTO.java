package com.FabricaEscuela.Feature1Back.DTO;

import com.FabricaEscuela.Feature1Back.entity.EstadoTurno;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TurnoDTO {

    private Long id;

    @NotNull(message = "La ruta es obligatoria")
    private Long rutaId;

    private String rutaNombre; // Para respuestas

    @NotNull(message = "El día de la semana es obligatorio")
    private DayOfWeek diaSemana;

    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime horaInicio;

    @NotNull(message = "La hora de fin es obligatoria")
    private LocalTime horaFin;

    private Integer duracionHoras;

    @NotNull(message = "El número de semana es obligatorio")
    @Min(value = 1, message = "El número de semana debe ser al menos 1")
    @Max(value = 52, message = "El número de semana no puede ser mayor a 52")
    private Integer numeroSemana;

    @NotNull(message = "El estado es obligatorio")
    private EstadoTurno estado;

    // Campo adicional para saber si tiene conductor asignado
    private boolean tieneAsignacion;

    private String conductorAsignado; // Nombre del conductor (si existe)
}