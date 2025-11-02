package com.FabricaEscuela.Feature1Back.DTO;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RutaDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombre;

    @NotBlank(message = "El origen es obligatorio")
    private String origen;

    @NotBlank(message = "El destino es obligatorio")
    private String destino;

    @Min(value = 1, message = "La duración debe ser al menos 1 minuto")
    private Integer duracionEnMinutos;

    // ✅ Campos adicionales para compatibilidad con frontend
    private String codigo; // ID formateado como "R001"
    private String description; // Descripción generada

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public @NotBlank(message = "El nombre es obligatorio") String getNombre() {
        return nombre;
    }

    public void setNombre(@NotBlank(message = "El nombre es obligatorio") String nombre) {
        this.nombre = nombre;
    }

    public @NotBlank(message = "El origen es obligatorio") String getOrigen() {
        return origen;
    }

    public void setOrigen(@NotBlank(message = "El origen es obligatorio") String origen) {
        this.origen = origen;
    }

    public @NotBlank(message = "El destino es obligatorio") String getDestino() {
        return destino;
    }

    public void setDestino(@NotBlank(message = "El destino es obligatorio") String destino) {
        this.destino = destino;
    }

    public @Min(value = 1, message = "La duración debe ser al menos 1 minuto") Integer getDuracionEnMinutos() {
        return duracionEnMinutos;
    }

    public void setDuracionEnMinutos(@Min(value = 1, message = "La duración debe ser al menos 1 minuto") Integer duracionEnMinutos) {
        this.duracionEnMinutos = duracionEnMinutos;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}