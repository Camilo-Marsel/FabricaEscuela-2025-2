// frontend/src/services/driverService.ts
import api from './api';

export interface ConductorInfo {
    id: number;
    cedula: string;
    nombreCompleto: string;
    telefono?: string;
    licencia?: string;
    email: string;
    username: string;
    usuarioCorreo: string;
}

export interface TurnoActual {
    tieneAsignacion: boolean;
    mensaje?: string;
    asignacion?: {
        id: number;
        turnoId: number;
        conductorId: number;
        conductorNombre: string;
        rutaNombre: string;
        diaSemanaNombre: string;
        numeroSemana: number;
        horarioTurno: string;
        fechaInicio: string;
        fechaFin?: string;
        estado: string;
    };
}

export interface ProximoTurno {
    id: number;
    turnoId: number;
    conductorId: number;
    conductorNombre: string;
    rutaNombre: string;
    diaSemanaNombre: string;
    numeroSemana: number;
    horarioTurno: string;
    fechaInicio: string;
    fechaFin?: string;
    estado: string;
}

/**
 * Obtener información del conductor logueado
 */
export const getMiInformacion = async (): Promise<ConductorInfo> => {
    return api.get<ConductorInfo>('/api/conductores/me');
};

/**
 * Obtener turno actual (hoy) del conductor
 */
export const getMiTurnoActual = async (): Promise<TurnoActual> => {
    return api.get<TurnoActual>('/api/asignaciones/conductor/me/actual');
};

/**
 * Obtener próximos turnos del conductor (7 días)
 */
export const getMisProximosTurnos = async (): Promise<ProximoTurno[]> => {
    return api.get<ProximoTurno[]>('/api/asignaciones/conductor/me/proximos');
};

/**
 * Iniciar turno (cambiar estado a EN_CURSO)
 */
export const iniciarTurno = async (asignacionId: number): Promise<any> => {
    return api.patch(`/api/asignaciones/${asignacionId}/iniciar`);
};

/**
 * Finalizar turno (cambiar estado a COMPLETADA)
 */
export const finalizarTurno = async (asignacionId: number): Promise<any> => {
    return api.patch(`/api/asignaciones/${asignacionId}/finalizar`);
};
