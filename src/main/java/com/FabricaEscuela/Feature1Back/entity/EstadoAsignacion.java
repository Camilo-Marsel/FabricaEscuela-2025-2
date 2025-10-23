package com.FabricaEscuela.Feature1Back.entity;

public enum EstadoAsignacion {
    PROGRAMADA,   // Asignación futura, aún no inicia
    EN_CURSO,     // El turno está activo AHORA
    FINALIZADA,   // El turno ya terminó
    CANCELADA     // Se canceló la asignación
}