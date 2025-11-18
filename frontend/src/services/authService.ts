// frontend/src/services/authService.ts
// Servicio de autenticación para FleetGuard360 (HU-1)

import { authAPI, saveAuth, clearAuth, getAuthData, isAuthenticated } from './api';

// ========================================
// INTERFACES
// ========================================

export interface AuthResponse {
    token: string;
    correo: string;
    rol: 'ADMIN' | 'CONDUCTOR';
    mensaje: string;
}

export interface MessageResponse {
    mensaje: string;
}

export interface LoginCredentials {
    identifier: string; // Puede ser correo o cédula
    password: string;
}

export interface VerifyCodeData {
    correo: string;
    codigo: string;
}

// ========================================
// GESTIÓN DE SESIÓN
// ========================================

/**
 * Guarda los datos de autenticación en localStorage
 */
export const guardarSesion = (authResponse: AuthResponse): void => {
    saveAuth(authResponse.token, authResponse.correo, authResponse.rol);
    console.log('✅ Sesión guardada:', {
        correo: authResponse.correo,
        rol: authResponse.rol,
    });
};

/**
 * Cierra la sesión del usuario
 */
export const cerrarSesion = (): void => {
    clearAuth();
    console.log('🚪 Sesión cerrada');
};

/**
 * Obtiene los datos de la sesión actual
 */
export const obtenerSesion = () => getAuthData();

/**
 * Verifica si hay una sesión activa
 */
export const sesionActiva = (): boolean => isAuthenticated();

/**
 * Obtiene el rol del usuario actual
 */
export const obtenerRolActual = (): 'ADMIN' | 'CONDUCTOR' | null => {
    const { rol } = getAuthData();
    return rol as 'ADMIN' | 'CONDUCTOR' | null;
};

/**
 * Verifica si el usuario es Admin
 */
export const esAdmin = (): boolean => obtenerRolActual() === 'ADMIN';

/**
 * Verifica si el usuario es Conductor
 */
export const esConductor = (): boolean => obtenerRolActual() === 'CONDUCTOR';

// ========================================
// DETECCIÓN DE TIPO DE IDENTIFICADOR
// ========================================

/**
 * Detecta si el identificador es un correo o una cédula
 */
const esCorreo = (identifier: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(identifier);
};

/**
 * Detecta si el identificador es una cédula (solo números)
 */
const esCedula = (identifier: string): boolean => {
    const cedulaRegex = /^\d{6,10}$/;
    return cedulaRegex.test(identifier);
};

// ========================================
// FUNCIONES DE AUTENTICACIÓN
// ========================================

/**
 * LOGIN INTELIGENTE
 * Detecta automáticamente si es correo o cédula y usa el endpoint correcto
 */
export const login = async (
    credentials: LoginCredentials
): Promise<{
    tipo: 'correo' | 'cedula';
    requiresCode: boolean;
    response: AuthResponse | MessageResponse;
}> => {
    const { identifier, password } = credentials;

    try {
        // Caso 1: Es un correo - Flujo con código de verificación
        if (esCorreo(identifier)) {
            console.log('📧 Login con correo detectado');
            const response = await authAPI.login(identifier, password);

            return {
                tipo: 'correo',
                requiresCode: true,
                response,
            };
        }

        // Caso 2: Es una cédula - Login directo
        if (esCedula(identifier)) {
            console.log('🆔 Login con cédula detectado');
            const response = await authAPI.loginConCedula(identifier, password);
            guardarSesion(response);

            return {
                tipo: 'cedula',
                requiresCode: false,
                response,
            };
        }

        // Caso 3: Formato no válido
        throw new Error(
            'Formato inválido. Ingresa un correo válido o una cédula de 6-10 dígitos.'
        );
    } catch (error) {
        console.error('❌ Error en login:', error);
        throw error;
    }
};

/**
 * LOGIN CON CORREO (Paso 1)
 * Envía código de verificación al correo
 */
export const loginConCorreo = async (
    correo: string,
    password: string
): Promise<MessageResponse> => {
    try {
        if (!esCorreo(correo)) {
            throw new Error('El correo ingresado no es válido');
        }

        console.log('📧 Enviando código de verificación a:', correo);
        const response = await authAPI.login(correo, password);

        // Guardar correo temporalmente para el paso 2
        sessionStorage.setItem('temp_correo', correo);

        return response;
    } catch (error) {
        console.error('❌ Error al enviar código:', error);
        throw error;
    }
};

/**
 * VERIFICAR CÓDIGO (Paso 2)
 * Verifica el código de 6 dígitos y completa el login
 */
export const verificarCodigo = async (
    data: VerifyCodeData
): Promise<AuthResponse> => {
    try {
        const { correo, codigo } = data;

        if (!codigo || codigo.length !== 6) {
            throw new Error('El código debe tener 6 dígitos');
        }

        console.log('🔐 Verificando código para:', correo);
        const response = await authAPI.verify(correo, codigo);

        // Guardar sesión
        guardarSesion(response);

        // Limpiar correo temporal
        sessionStorage.removeItem('temp_correo');

        return response;
    } catch (error) {
        console.error('❌ Error al verificar código:', error);
        throw error;
    }
};

/**
 * LOGIN CON CÉDULA (Directo)
 * Login sin verificación de código
 */
export const loginConCedula = async (
    cedula: string,
    password: string
): Promise<AuthResponse> => {
    try {
        if (!esCedula(cedula)) {
            throw new Error('La cédula debe contener entre 6 y 10 dígitos');
        }

        console.log('🆔 Login directo con cédula');
        const response = await authAPI.loginConCedula(cedula, password);

        // Guardar sesión
        guardarSesion(response);

        return response;
    } catch (error) {
        console.error('❌ Error en login con cédula:', error);
        throw error;
    }
};

/**
 * VALIDAR TOKEN
 * Verifica si el token actual es válido
 */
export const validarToken = async (): Promise<boolean> => {
    try {
        if (!sesionActiva()) {
            return false;
        }

        const response = await authAPI.validate();

        // Actualizar datos de sesión por si cambiaron
        guardarSesion(response);

        console.log('✅ Token validado correctamente');
        return true;
    } catch (error) {
        console.error('❌ Token inválido:', error);
        cerrarSesion();
        return false;
    }
};

/**
 * OBTENER CORREO TEMPORAL
 * Recupera el correo guardado temporalmente durante el flujo de verificación
 */
export const obtenerCorreoTemporal = (): string | null => {
    return sessionStorage.getItem('temp_correo');
};

// ========================================
// REDIRECCIÓN SEGÚN ROL
// ========================================

/**
 * Obtiene la ruta de redirección según el rol del usuario
 */
export const obtenerRutaSegunRol = (rol: string): string => {
    switch (rol.toUpperCase()) {
        case 'ADMIN':
            return '/dashboard';
        case 'CONDUCTOR':
            return '/driver-dashboard';
        default:
            return '/';
    }
};

/**
 * Redirige al usuario según su rol
 */
export const redirigirSegunRol = (): void => {
    const { rol } = obtenerSesion();
    if (rol) {
        const ruta = obtenerRutaSegunRol(rol);
        window.location.href = ruta;
    }
};

// ========================================
// VALIDACIONES
// ========================================

/**
 * Valida el formato del correo
 */
export const validarFormatoCorreo = (correo: string): boolean => {
    return esCorreo(correo);
};

/**
 * Valida el formato de la cédula
 */
export const validarFormatoCedula = (cedula: string): boolean => {
    return esCedula(cedula);
};

/**
 * Valida el formato del código de verificación
 */
export const validarFormatoCodigo = (codigo: string): boolean => {
    return /^\d{6}$/.test(codigo);
};

/**
 * Valida la contraseña (mínimo 6 caracteres)
 */
export const validarPassword = (password: string): boolean => {
    return password.length >= 6;
};

// ========================================
// UTILIDADES
// ========================================

/**
 * Formatea el identificador para mostrar
 */
export const formatearIdentificador = (identifier: string): string => {
    if (esCorreo(identifier)) {
        return `📧 ${identifier}`;
    }
    if (esCedula(identifier)) {
        return `🆔 ${identifier}`;
    }
    return identifier;
};

/**
 * Obtiene un mensaje de ayuda según el tipo de identificador
 */
export const obtenerMensajeAyuda = (): string => {
    return 'Puedes usar tu correo electrónico o tu número de cédula para iniciar sesión.';
};