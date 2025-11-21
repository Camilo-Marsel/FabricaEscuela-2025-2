// frontend/src/services/asignacionesService.ts
// Servicio para gestión de asignaciones de turnos a conductores

import { asignacionesAPI } from './api';


// ========================================
// INTERFACES
// ========================================

export interface AsignacionTurno {
    id: number;
    turnoId?: number;
    conductorId?: number;
    fechaInicio?: string;
    fechaFin?: string;
    estado?: 'PROGRAMADA' | 'EN_CURSO' | 'FINALIZADA' | 'CANCELADA';

    // Campos adicionales del backend
    conductorNombre?: string;
    rutaNombre?: string;
    diaSemanaNombre?: string;
    horarioTurno?: string;
    numeroSemana?: number;
    horaInicioReal?: string;
    horaFinReal?: string;

    // Objetos anidados (para compatibilidad con código legacy)
    turno?: {
        id: number;
        ruta?: {
            id: number;
            nombre: string;
            origen: string;
            destino: string;
        };
        diaSemana?: string;
        horaInicio?: string;
        horaFin?: string;
        numeroSemana?: number;
    };
    conductor?: {
        id: number;
        nombre?: string;
        apellido?: string;
        cedula?: string;
        estado?: string;
    };
}

export interface AsignacionForm {
    turnoId: number;
    conductorId: number;
    fechaInicio: string;
}

// ========================================
// FUNCIONES DEL SERVICIO
// ========================================

/**
 * Obtiene todas las asignaciones
 */
export const obtenerAsignaciones = async (): Promise<AsignacionTurno[]> => {
    try {
        return await asignacionesAPI.getAll();
    } catch (error) {
        console.error('Error al obtener asignaciones:', error);
        throw error;
    }
};

/**
 * Obtiene asignaciones por conductor
 */
export const obtenerAsignacionesPorConductor = async (
    conductorId: number
): Promise<AsignacionTurno[]> => {
    try {
        return await asignacionesAPI.getByConductor(conductorId);
    } catch (error) {
        console.error(`Error al obtener asignaciones del conductor ${conductorId}:`, error);
        throw error;
    }
};

/**
 * Obtiene asignaciones activas
 */
export const obtenerAsignacionesActivas = async (): Promise<AsignacionTurno[]> => {
    try {
        return await asignacionesAPI.getActivas();
    } catch (error) {
        console.error('Error al obtener asignaciones activas:', error);
        throw error;
    }
};

/**
 * Crea una nueva asignación
 */
export const crearAsignacion = async (data: AsignacionForm): Promise<AsignacionTurno> => {
    try {
        return await asignacionesAPI.create({
            conductorId: data.conductorId,
            turnoId: data.turnoId,
            fechaInicio: data.fechaInicio,  // ⭐ Ya no mapear
            estado: 'PROGRAMADA'  // ⭐ Agregar
        });
    } catch (error) {
        console.error('Error al crear asignación:', error);
        throw error;
    }
};

/**
 * Marca una asignación como iniciada
 */
export const iniciarAsignacion = async (id: number): Promise<AsignacionTurno> => {
    try {
        return await asignacionesAPI.iniciar(id);
    } catch (error) {
        console.error(`Error al iniciar asignación ${id}:`, error);
        throw error;
    }
};

/**
 * Marca una asignación como finalizada
 */
export const finalizarAsignacion = async (id: number): Promise<AsignacionTurno> => {
    try {
        return await asignacionesAPI.finalizar(id);
    } catch (error) {
        console.error(`Error al finalizar asignación ${id}:`, error);
        throw error;
    }
};


/**
 * Cancela una asignación
 */
export const cancelarAsignacion = async (id: number): Promise<void> => {
    try {
        await asignacionesAPI.cancelar(id);
    } catch (error) {
        console.error(`Error al cancelar asignación ${id}:`, error);
        throw error;
    }
};

// ========================================
// UTILIDADES Y VALIDACIONES
// ========================================

/**
 * Formatea el nombre completo del conductor
 */
export const formatearNombreConductor = (asignacion: AsignacionTurno): string => {
    // Primero intentar usar el campo plano del backend
    if (asignacion.conductorNombre) {
        return asignacion.conductorNombre;
    }

    // Fallback a objetos anidados (legacy)
    if (asignacion.conductor) {
        return `${asignacion.conductor.nombre} ${asignacion.conductor.apellido}`;
    }

    return 'Conductor desconocido';
};

/**
 * Formatea el horario del turno
 */
export const formatearHorario = (asignacion: AsignacionTurno): string => {
    // Primero intentar usar el campo plano del backend
    if (asignacion.horarioTurno) {
        return asignacion.horarioTurno;
    }

    // Fallback a objetos anidados (legacy)
    if (asignacion.turno) {
        return `${asignacion.turno.horaInicio} - ${asignacion.turno.horaFin}`;
    }

    return 'Horario no disponible';
};

/**
 * Formatea la fecha en formato legible
 */
export const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

/**
 * Formatea el día de la semana
 */
export const formatearDiaSemana = (dia: string): string => {
    const dias: Record<string, string> = {
        'MONDAY': 'Lunes',
        'TUESDAY': 'Martes',
        'WEDNESDAY': 'Miércoles',
        'THURSDAY': 'Jueves',
        'FRIDAY': 'Viernes',
        'SATURDAY': 'Sábado',
        'SUNDAY': 'Domingo',
        // Legacy
        'LUNES': 'Lunes',
        'MARTES': 'Martes',
        'MIERCOLES': 'Miércoles',
        'JUEVES': 'Jueves',
        'VIERNES': 'Viernes',
        'SABADO': 'Sábado',
        'DOMINGO': 'Domingo'
    };
    return dias[dia] || dia;
};

/**
 * Obtiene el color del badge según el estado
 */
export const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
        case 'PROGRAMADA':
            return 'bg-blue-100 text-blue-800';
        case 'EN_CURSO':
            return 'bg-green-100 text-green-800';
        case 'FINALIZADA':
            return 'bg-gray-100 text-gray-800';
        case 'CANCELADA':
            return 'bg-red-100 text-red-800';
        // Legacy
        case 'ASIGNADA':
            return 'bg-blue-100 text-blue-800';
        case 'INICIADA':
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

/**
 * Calcula la duración en horas
 */
export const calcularDuracion = (horaInicio: string, horaFin: string): number => {
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFin2, minFin] = horaFin.split(':').map(Number);

    const minutosInicio = horaIni * 60 + minIni;
    const minutosFin = horaFin2 * 60 + minFin;

    return (minutosFin - minutosInicio) / 60;
};

/**
 * Formatea la duración en formato legible
 */
export const formatearDuracion = (horas: number): string => {
    const horasEnteras = Math.floor(horas);
    const minutos = Math.round((horas - horasEnteras) * 60);

    if (minutos === 0) {
        return `${horasEnteras}h`;
    }
    return `${horasEnteras}h ${minutos}m`;
};

/**
 * Valida que la fecha de inicio no sea pasada
 */
export const validarFechaInicio = (fecha: string): boolean => {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fechaSeleccionada >= hoy;
};

/**
 * Valida los datos del formulario de asignación
 */
export const validarFormularioAsignacion = (data: AsignacionForm): {
    valid: boolean;
    errors: Record<string, string>;
} => {
    const errors: Record<string, string> = {};

    if (!data.turnoId) {
        errors.turnoId = 'Debe seleccionar un turno';
    }

    if (!data.conductorId) {
        errors.conductorId = 'Debe seleccionar un conductor';
    }

    if (!data.fechaInicio) {
        errors.fechaInicio = 'La fecha de inicio es requerida';
    } else if (!validarFechaInicio(data.fechaInicio)) {
        errors.fechaInicio = 'La fecha no puede ser anterior a hoy';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
};

/**
 * Filtra asignaciones por estado
 */
export const filtrarPorEstado = (
    asignaciones: AsignacionTurno[],
    estado: string
): AsignacionTurno[] => {
    return asignaciones.filter((a) => a.estado === estado);
};

/**
 * Filtra asignaciones por conductor
 */
export const filtrarPorConductor = (
    asignaciones: AsignacionTurno[],
    conductorId: number
): AsignacionTurno[] => {
    return asignaciones.filter((a) => a.conductorId === conductorId);
};

/**
 * Filtra asignaciones por ruta
 */
export const filtrarPorRuta = (
    asignaciones: AsignacionTurno[],
    rutaId: number
): AsignacionTurno[] => {
    if (!asignaciones) return [];

    return asignaciones.filter((a) => {
        // Intentar con campo plano
        if (a.turno?.ruta?.id) {
            return a.turno.ruta.id === rutaId;
        }
        // Fallback: si no hay turno anidado, no podemos filtrar
        return false;
    });
};