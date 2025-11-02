package com.FabricaEscuela.Feature1Back.entity;

public enum EstadoTurno {
    ACTIVO,      // Turno disponible para asignación
    INACTIVO,    // Turno fuera de horario de operación (ej: madrugada)
    CANCELADO    // Turno cancelado por alguna razón
}