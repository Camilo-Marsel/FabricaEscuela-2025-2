package com.FabricaEscuela.Feature1Back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asignaciones_turno")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AsignacionTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "turno_id", nullable = false)
    private Turno turno;

    @ManyToOne
    @JoinColumn(name = "conductor_id", nullable = false)
    private Conductor conductor;

    @Column(nullable = false)
    private LocalDate fechaInicio; // Desde cuándo aplica esta asignación

    @Column
    private LocalDate fechaFin; // null = indefinido (hasta que se cambie)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoAsignacion estado;

    @Column
    private LocalDateTime horaInicioReal; // Cuando realmente inició (para tracking)

    @Column
    private LocalDateTime horaFinReal; // Cuando realmente terminó

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Turno getTurno() {
        return turno;
    }

    public void setTurno(Turno turno) {
        this.turno = turno;
    }

    public Conductor getConductor() {
        return conductor;
    }

    public void setConductor(Conductor conductor) {
        this.conductor = conductor;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public EstadoAsignacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoAsignacion estado) {
        this.estado = estado;
    }

    public LocalDateTime getHoraInicioReal() {
        return horaInicioReal;
    }

    public void setHoraInicioReal(LocalDateTime horaInicioReal) {
        this.horaInicioReal = horaInicioReal;
    }

    public LocalDateTime getHoraFinReal() {
        return horaFinReal;
    }

    public void setHoraFinReal(LocalDateTime horaFinReal) {
        this.horaFinReal = horaFinReal;
    }
}