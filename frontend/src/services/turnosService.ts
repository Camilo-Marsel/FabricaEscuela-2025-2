// Mock service for shift management
// TODO: Replace with actual Supabase/API integration when backend is ready

import turnosMock from '@/mocks/turnosMock.json';
import driversMock from '@/mocks/driversMock.json';
import routesMock from '@/mocks/routesData.json';

export interface Turno {
  id: string;
  driverId: string;
  driverName: string;
  driverLicense: string;
  routeId: string;
  routeName: string;
  startDate: string;
  startTime: string;
  duration: number;
  status: 'active' | 'completed' | 'cancelled';
}

export interface Driver {
  id: string;
  name: string;
  license: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  duration: string;
}

// In-memory storage (simulating database)
let turnos: Turno[] = [...turnosMock] as Turno[];
const drivers: Driver[] = [...driversMock] as Driver[];

// Parse duration string (e.g., "1h 30m") to hours
const parseDuration = (durationStr: string): number => {
  const match = durationStr.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0');
  const minutes = parseInt(match[2] || '0');
  return hours + minutes / 60;
};

// Get all shifts
export const getTurnos = async (): Promise<Turno[]> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').select('*');
  return new Promise((resolve) => {
    setTimeout(() => resolve([...turnos]), 300);
  });
};

// Get all drivers
export const getDrivers = async (): Promise<Driver[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => resolve([...drivers]), 300);
  });
};

// Get all routes
export const getRoutes = async (): Promise<Route[]> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => resolve([...routesMock]), 300);
  });
};

// Check if time ranges overlap
const timeRangesOverlap = (
  start1: string,
  duration1: number,
  start2: string,
  duration2: number
): boolean => {
  const [h1, m1] = start1.split(':').map(Number);
  const [h2, m2] = start2.split(':').map(Number);
  
  const start1Minutes = h1 * 60 + m1;
  const end1Minutes = start1Minutes + duration1 * 60;
  const start2Minutes = h2 * 60 + m2;
  const end2Minutes = start2Minutes + duration2 * 60;
  
  return start1Minutes < end2Minutes && end1Minutes > start2Minutes;
};

// Validate shift assignment
export const validateShiftAssignment = async (
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string,
  excludeShiftId?: string
): Promise<{ valid: boolean; error?: string; totalHours?: number }> => {
  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { valid: false, error: 'Ruta no encontrada' };
  }

  const duration = parseDuration(route.duration);
  
  // Get all shifts for this driver on the same date
  const driverShifts = turnos.filter(
    t => t.driverId === driverId && 
         t.startDate === startDate && 
         t.id !== excludeShiftId &&
         t.status === 'active'
  );

  // Check for time conflicts with driver
  for (const shift of driverShifts) {
    if (timeRangesOverlap(startTime, duration, shift.startTime, shift.duration)) {
      return { 
        valid: false, 
        error: 'Error de asignación: El conductor o la ruta ya están ocupados en el horario especificado.' 
      };
    }
  }

  // Check for time conflicts with route
  const routeShifts = turnos.filter(
    t => t.routeId === routeId && 
         t.startDate === startDate && 
         t.id !== excludeShiftId &&
         t.status === 'active'
  );

  for (const shift of routeShifts) {
    if (timeRangesOverlap(startTime, duration, shift.startTime, shift.duration)) {
      return { 
        valid: false, 
        error: 'Error de asignación: El conductor o la ruta ya están ocupados en el horario especificado.' 
      };
    }
  }

  // Calculate total hours for the driver on this date
  const totalHours = driverShifts.reduce((sum, shift) => sum + shift.duration, 0) + duration;

  // Check if total hours exceed 7.5
  if (totalHours > 7.5) {
    return { 
      valid: false, 
      error: 'Límite de jornada excedido: Este turno supera las 7.5 horas de trabajo para el conductor en este día.',
      totalHours 
    };
  }

  return { valid: true, totalHours };
};

// Assign new shift
export const assignShift = async (
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string; shift?: Turno }> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').insert({...});
  
  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return { success: false, error: 'Conductor no encontrado' };
  }

  if (driver.status === 'inactive') {
    return { success: false, error: 'El conductor seleccionado no se encuentra en estado \'activo\'' };
  }

  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { success: false, error: 'Ruta no encontrada' };
  }

  const validation = await validateShiftAssignment(driverId, routeId, startDate, startTime);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const newShift: Turno = {
    id: `T${String(turnos.length + 1).padStart(3, '0')}`,
    driverId,
    driverName: driver.name,
    driverLicense: driver.license,
    routeId,
    routeName: route.name,
    startDate,
    startTime,
    duration: parseDuration(route.duration),
    status: 'active'
  };

  turnos.push(newShift);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, shift: newShift }), 300);
  });
};

// Edit existing shift
export const editShift = async (
  shiftId: string,
  driverId: string,
  routeId: string,
  startDate: string,
  startTime: string
): Promise<{ success: boolean; error?: string; shift?: Turno }> => {
  // TODO: Replace with actual API call
  // const { data, error } = await supabase.from('turnos').update({...}).eq('id', shiftId);

  const driver = drivers.find(d => d.id === driverId);
  if (!driver) {
    return { success: false, error: 'Conductor no encontrado' };
  }

  if (driver.status === 'inactive') {
    return { success: false, error: 'El conductor seleccionado no se encuentra en estado \'activo\'' };
  }

  const route = routesMock.find(r => r.id === routeId);
  if (!route) {
    return { success: false, error: 'Ruta no encontrada' };
  }

  const validation = await validateShiftAssignment(driverId, routeId, startDate, startTime, shiftId);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const shiftIndex = turnos.findIndex(t => t.id === shiftId);
  if (shiftIndex === -1) {
    return { success: false, error: 'Turno no encontrado' };
  }

  const updatedShift: Turno = {
    id: shiftId,
    driverId,
    driverName: driver.name,
    driverLicense: driver.license,
    routeId,
    routeName: route.name,
    startDate,
    startTime,
    duration: parseDuration(route.duration),
    status: 'active'
  };

  turnos[shiftIndex] = updatedShift;

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true, shift: updatedShift }), 300);
  });
};

// Delete shift
export const deleteShift = async (shiftId: string): Promise<{ success: boolean; error?: string }> => {
  // TODO: Replace with actual API call
  // const { error } = await supabase.from('turnos').delete().eq('id', shiftId);

  const shiftIndex = turnos.findIndex(t => t.id === shiftId);
  if (shiftIndex === -1) {
    return { success: false, error: 'Turno no encontrado' };
  }

  turnos = turnos.filter(t => t.id !== shiftId);

  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
};