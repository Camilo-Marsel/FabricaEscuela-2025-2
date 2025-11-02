// frontend/src/services/api.ts

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Obtener token
const getToken = (): string | null => localStorage.getItem('token');

// Guardar auth
export const saveAuth = (token: string, correo: string, rol: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('correo', correo);
    localStorage.setItem('rol', rol);
};

// Limpiar auth
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('correo');
    localStorage.removeItem('rol');
};

// Obtener datos de auth
export const getAuthData = () => ({
    token: localStorage.getItem('token'),
    correo: localStorage.getItem('correo'),
    rol: localStorage.getItem('rol'),
});

// Fetch genérico
async function fetchAPI<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login';
        throw new Error('Sesión expirada');
    }

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || error.mensaje || `Error ${response.status}`);
    }

    return response.json();
}

// API genérica
const api = {
    get: <T = any>(endpoint: string) => fetchAPI<T>(endpoint),
    post: <T = any>(endpoint: string, data?: any) =>
        fetchAPI<T>(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),
    put: <T = any>(endpoint: string, data?: any) =>
        fetchAPI<T>(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),
    patch: <T = any>(endpoint: string, data?: any) =>
        fetchAPI<T>(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),
    delete: <T = any>(endpoint: string) =>
        fetchAPI<T>(endpoint, { method: 'DELETE' }),
};

export default api;

// Exportar APIs específicas
export const authAPI = {
    login: (correo: string, password: string) =>
        api.post('/auth/login', { correo, password }),
    verify: (correo: string, codigo: string) =>
        api.post('/auth/verify', { correo, codigo }),
    validate: () => api.get('/auth/validate'),
};

export const conductoresAPI = {
    getAll: () => api.get('/conductores'),
    getById: (id: number) => api.get(`/conductores/${id}`),
    create: (data: any) => api.post('/conductores', data),
    update: (id: number, data: any) => api.put(`/conductores/${id}`, data),
    delete: (id: number) => api.delete(`/conductores/${id}`),
};

export const rutasAPI = {
    getAll: () => api.get('/rutas'),
    getById: (id: number) => api.get(`/rutas/${id}`),
    create: (data: any) => api.post('/rutas', data),
    update: (id: number, data: any) => api.put(`/rutas/${id}`, data),
    delete: (id: number) => api.delete(`/rutas/${id}`),
};

export const turnosAPI = {
    getAll: () => api.get('/turnos'),
    getByRuta: (rutaId: number) => api.get(`/turnos/ruta/${rutaId}`),
    getByRutaYSemana: (rutaId: number, semana: number) =>
        api.get(`/turnos/ruta/${rutaId}/semana/${semana}`),
    create: (data: any) => api.post('/turnos', data),
    createAuto: (rutaId: number, horaInicio: string, horaFin: string, numeroSemana: number) =>
        api.post(`/turnos/auto?rutaId=${rutaId}&horaInicio=${horaInicio}&horaFin=${horaFin}&numeroSemana=${numeroSemana}`),
    delete: (id: number) => api.delete(`/turnos/${id}`),
};

export const asignacionesAPI = {
    getAll: () => api.get('/asignaciones'),
    getByConductor: (conductorId: number) =>
        api.get(`/asignaciones/conductor/${conductorId}`),
    getActivas: () => api.get('/asignaciones/activas'),
    create: (data: any) => api.post('/asignaciones', data),
    iniciar: (id: number) => api.patch(`/asignaciones/${id}/iniciar`),
    finalizar: (id: number) => api.patch(`/asignaciones/${id}/finalizar`),
    cancelar: (id: number) => api.delete(`/asignaciones/${id}`),
};