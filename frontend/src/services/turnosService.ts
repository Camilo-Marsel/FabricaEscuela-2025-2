// frontend/src/services/turnosService.ts
// Servicio REAL para gestión de turnos (plantillas de horarios)
// Reemplaza el mock anterior conectándose con el backend

import { turnosAPI } from './api';

// ========================================
// INTERFACES
// ========================================

export interface Turno {
  id: number;
  ruta: {
    id: number;
    nombre: string;
    origen: string;
    destino: string;
  };
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
  estado: 'ACTIVO' | 'INACTIVO';
}

export interface TurnoForm {
  rutaId: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
}

export interface PreviewTurno {
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  duracion: number;
}

export interface PreviewResponse {
  totalTurnos: number;
  turnosPorDia: number;
  turnos: PreviewTurno[];
  advertencias?: string[];
}

export interface CreateAutoRequest {
  rutaId: number;
  horaInicio: string;
  horaFin: string;
  numeroSemana: number;
}

// ========================================
// FUNCIONES DEL SERVICIO
// ========================================

/**
 * Obtiene todos los turnos (plantillas)
 */
export const obtenerTurnos = async (): Promise<Turno[]> => {
  try {
    return await turnosAPI.getAll();
  } catch (error) {
    console.error('Error al obtener turnos:', error);
    throw error;
  }
};

/**
 * Obtiene un turno por ID
 */
export const obtenerTurnoPorId = async (id: number): Promise<Turno> => {
  try {
    return await turnosAPI.getById(id);
  } catch (error) {
    console.error(`Error al obtener turno ${id}:`, error);
    throw error;
  }
};

/**
 * Obtiene turnos por ruta
 */
export const obtenerTurnosPorRuta = async (rutaId: number): Promise<Turno[]> => {
  try {
    return await turnosAPI.getByRuta(rutaId);
  } catch (error) {
    console.error(`Error al obtener turnos de ruta ${rutaId}:`, error);
    throw error;
  }
};

/**
 * Obtiene turnos por ruta y semana
 */
export const obtenerTurnosPorRutaYSemana = async (
    rutaId: number,
    numeroSemana: number
): Promise<Turno[]> => {
  try {
    return await turnosAPI.getByRutaAndSemana(rutaId, numeroSemana);
  } catch (error) {
    console.error(`Error al obtener turnos de ruta ${rutaId} semana ${numeroSemana}:`, error);
    throw error;
  }
};

/**
 * Previsualiza turnos automáticos antes de crear
 */
export const previsualizarTurnosAutomaticos = async (
    rutaId: number,
    horaInicio: string,
    horaFin: string,
    numeroSemana: number
): Promise<PreviewResponse> => {
  try {
    return await turnosAPI.previsualizarAuto(rutaId, horaInicio, horaFin, numeroSemana);
  } catch (error) {
    console.error('Error al previsualizar turnos:', error);
    throw error;
  }
};

/**
 * Crea turnos automáticamente
 */
export const crearTurnosAutomaticos = async (
    data: CreateAutoRequest
): Promise<PreviewResponse> => {
  try {
    return await turnosAPI.createAuto(
        data.rutaId,
        data.horaInicio,
        data.horaFin,
        data.numeroSemana
    );
  } catch (error) {
    console.error('Error al crear turnos automáticos:', error);
    throw error;
  }
};

/**
 * Crea un turno manual
 */
export const crearTurno = async (data: TurnoForm): Promise<Turno> => {
  try {
    return await turnosAPI.create(data);
  } catch (error) {
    console.error('Error al crear turno:', error);
    throw error;
  }
};

/**
 * Actualiza un turno existente
 */
export const actualizarTurno = async (
    id: number,
    data: TurnoForm
): Promise<Turno> => {
  try {
    return await turnosAPI.update(id, data);
  } catch (error) {
    console.error(`Error al actualizar turno ${id}:`, error);
    throw error;
  }
};

/**
 * Elimina un turno
 */
export const eliminarTurno = async (id: number): Promise<void> => {
  try {
    await turnosAPI.delete(id);
  } catch (error) {
    console.error(`Error al eliminar turno ${id}:`, error);
    throw error;
  }
};

// ========================================
// UTILIDADES Y VALIDACIONES
// ========================================

/**
 * Valida el formato de hora (HH:mm)
 */
export const validarFormatoHora = (hora: string): boolean => {
  const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(hora);
};

/**
 * Valida que hora fin sea mayor que hora inicio
 */
export const validarRangoHorario = (horaInicio: string, horaFin: string): boolean => {
  if (!validarFormatoHora(horaInicio) || !validarFormatoHora(horaFin)) {
    return false;
  }

  const [horaIni, minIni] = horaInicio.split(':').map(Number);
  const [horaFin2, minFin] = horaFin.split(':').map(Number);

  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin2 * 60 + minFin;

  return minutosFin > minutosInicio;
};

/**
 * Calcula la duración en horas entre dos horarios
 */
export const calcularDuracion = (horaInicio: string, horaFin: string): number => {
  const [horaIni, minIni] = horaInicio.split(':').map(Number);
  const [horaFin2, minFin] = horaFin.split(':').map(Number);

  const minutosInicio = horaIni * 60 + minIni;
  const minutosFin = horaFin2 * 60 + minFin;

  return (minutosFin - minutosInicio) / 60;
};

/**
 * Formatea la duración en formato legible (ej: "8h", "7.5h")
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
 * Días de la semana en español
 */
export const DIAS_SEMANA = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO'
] as const;

/**
 * Obtiene el nombre del día en formato legible
 */
export const formatearDiaSemana = (dia: string): string => {
  const dias: Record<string, string> = {
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
    case 'ACTIVO':
      return 'bg-green-100 text-green-800';
    case 'INACTIVO':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

/**
 * Valida los datos del formulario de turno manual
 */
export const validarFormularioTurno = (data: TurnoForm): {
  valid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};

  if (!data.rutaId) {
    errors.rutaId = 'Debe seleccionar una ruta';
  }

  if (!data.diaSemana) {
    errors.diaSemana = 'Debe seleccionar un día de la semana';
  }

  if (!data.horaInicio) {
    errors.horaInicio = 'La hora de inicio es requerida';
  } else if (!validarFormatoHora(data.horaInicio)) {
    errors.horaInicio = 'Formato de hora inválido (use HH:mm)';
  }

  if (!data.horaFin) {
    errors.horaFin = 'La hora de fin es requerida';
  } else if (!validarFormatoHora(data.horaFin)) {
    errors.horaFin = 'Formato de hora inválido (use HH:mm)';
  }

  if (data.horaInicio && data.horaFin && !validarRangoHorario(data.horaInicio, data.horaFin)) {
    errors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
  }

  const duracion = calcularDuracion(data.horaInicio, data.horaFin);
  if (duracion > 8) {
    errors.horaFin = 'El turno no puede superar las 8 horas';
  }

  if (!data.numeroSemana || data.numeroSemana < 1 || data.numeroSemana > 52) {
    errors.numeroSemana = 'El número de semana debe estar entre 1 y 52';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};