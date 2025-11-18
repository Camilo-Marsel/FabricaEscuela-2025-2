// frontend/src/services/conductoresService.ts
// Servicio para gestión de conductores (HU-3)

import { conductoresAPI } from './api';

// ========================================
// INTERFACES
// ========================================

export interface Conductor {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    correo: string;
    estado: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}

export interface ConductorForm {
    nombre: string;
    apellido: string;
    cedula: string;
    telefono: string;
    correo: string;
    estado?: string;
}

// ========================================
// FUNCIONES DEL SERVICIO
// ========================================

/**
 * Obtiene todos los conductores
 */
export const obtenerConductores = async (): Promise<Conductor[]> => {
    try {
        return await conductoresAPI.getAll();
    } catch (error) {
        console.error('Error al obtener conductores:', error);
        throw error;
    }
};

/**
 * Obtiene un conductor por ID
 */
export const obtenerConductorPorId = async (id: number): Promise<Conductor> => {
    try {
        return await conductoresAPI.getById(id);
    } catch (error) {
        console.error(`Error al obtener conductor ${id}:`, error);
        throw error;
    }
};

/**
 * Crea un nuevo conductor
 */
export const crearConductor = async (data: ConductorForm): Promise<Conductor> => {
    try {
        const conductorData = {
            ...data,
            estado: data.estado || 'ACTIVO',
        };
        return await conductoresAPI.create(conductorData);
    } catch (error) {
        console.error('Error al crear conductor:', error);
        throw error;
    }
};

/**
 * Actualiza un conductor existente
 */
export const actualizarConductor = async (
    id: number,
    data: ConductorForm
): Promise<Conductor> => {
    try {
        return await conductoresAPI.update(id, data);
    } catch (error) {
        console.error(`Error al actualizar conductor ${id}:`, error);
        throw error;
    }
};

/**
 * Elimina un conductor
 */
export const eliminarConductor = async (id: number): Promise<void> => {
    try {
        await conductoresAPI.delete(id);
    } catch (error) {
        console.error(`Error al eliminar conductor ${id}:`, error);
        throw error;
    }
};

/**
 * Busca conductores por término
 */
export const buscarConductores = async (termino: string): Promise<Conductor[]> => {
    try {
        if (!termino.trim()) {
            return await obtenerConductores();
        }
        return await conductoresAPI.buscar(termino);
    } catch (error) {
        console.error('Error al buscar conductores:', error);
        throw error;
    }
};

/**
 * Valida el formato de la cédula
 */
export const validarCedula = (cedula: string): boolean => {
    // Validación básica: solo números y entre 6-10 dígitos
    const regex = /^\d{6,10}$/;
    return regex.test(cedula);
};

/**
 * Valida el formato del correo
 */
export const validarCorreo = (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
};

/**
 * Valida el formato del teléfono
 */
export const validarTelefono = (telefono: string): boolean => {
    // Validación básica: solo números y entre 7-15 dígitos
    const regex = /^\d{7,15}$/;
    return regex.test(telefono);
};

/**
 * Valida los datos del formulario de conductor
 */
export const validarFormularioConductor = (data: ConductorForm): {
    valid: boolean;
    errors: Record<string, string>;
} => {
    const errors: Record<string, string> = {};

    if (!data.nombre.trim()) {
        errors.nombre = 'El nombre es requerido';
    }

    if (!data.apellido.trim()) {
        errors.apellido = 'El apellido es requerido';
    }

    if (!data.cedula.trim()) {
        errors.cedula = 'La cédula es requerida';
    } else if (!validarCedula(data.cedula)) {
        errors.cedula = 'La cédula debe contener entre 6 y 10 dígitos';
    }

    if (!data.telefono.trim()) {
        errors.telefono = 'El teléfono es requerido';
    } else if (!validarTelefono(data.telefono)) {
        errors.telefono = 'El teléfono debe contener entre 7 y 15 dígitos';
    }

    if (!data.correo.trim()) {
        errors.correo = 'El correo es requerido';
    } else if (!validarCorreo(data.correo)) {
        errors.correo = 'El correo no es válido';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors,
    };
};

/**
 * Filtra conductores activos
 */
export const obtenerConductoresActivos = (conductores: Conductor[]): Conductor[] => {
    return conductores.filter((c) => c.estado === 'ACTIVO');
};

/**
 * Formatea el nombre completo del conductor
 */
export const formatearNombreConductor = (conductor: Conductor): string => {
    return `${conductor.nombre} ${conductor.apellido}`;
};

/**
 * Obtiene el color del badge según el estado
 */
export const obtenerColorEstado = (estado: string): string => {
    switch (estado) {
        case 'ACTIVO':
            return 'bg-green-100 text-green-800';
        case 'INACTIVO':
            return 'bg-gray-100 text-gray-800';
        case 'SUSPENDIDO':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};