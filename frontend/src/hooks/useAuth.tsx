// frontend/src/hooks/useAuth.ts
// Hook de autenticación REAL conectado al backend
// Mantiene compatibilidad con la interfaz anterior

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  sesionActiva,
  obtenerSesion,
  cerrarSesion,
  validarToken,
  login as loginService,
  verificarCodigo as verificarCodigoService,
} from '@/services/authService';

// ========================================
// TIPOS
// ========================================

export type UserRole = 'admin' | 'driver' | 'CONDUCTOR' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isDriver: boolean;
}

interface UseAuthReturn extends AuthState {
  login: (identifier: string, password: string) => Promise<LoginResult>;
  verifyCode: (codigo: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

interface LoginResult {
  requiresCode: boolean;
  correo?: string;
}

// ========================================
// MAPEO DE ROLES
// ========================================

/**
 * Convierte roles del backend (ADMIN/CONDUCTOR) a roles del frontend (admin/driver)
 */
const mapRolBackendToFrontend = (rolBackend: string | null): UserRole => {
  if (!rolBackend) return null;

  switch (rolBackend.toUpperCase()) {
    case 'ADMIN':
      return 'admin';
    case 'CONDUCTOR':
      return 'driver';
    default:
      return null;
  }
};

/**
 * Extrae el nombre del correo
 * Ejemplo: "juan.perez@example.com" → "Juan Perez"
 */
const extractNameFromEmail = (email: string): string => {
  const username = email.split('@')[0];
  return username
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
};

// ========================================
// HOOK useAuth
// ========================================

/**
 * Hook principal de autenticación
 * Conectado al backend real con JWT
 *
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useAuth();
 *
 * // Login con cédula o correo
 * const result = await login('1234567890', 'password');
 * if (result.requiresCode) {
 *   // Mostrar formulario de código
 * }
 * ```
 */
export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    isAuthenticated: false,
    isAdmin: false,
    isDriver: false,
  });

  const [correoTemporal, setCorreoTemporal] = useState<string>('');

  useEffect(() => {
    checkAuthentication();
  }, []);

  // ========================================
  // VERIFICACIÓN DE AUTENTICACIÓN
  // ========================================

  const checkAuthentication = async () => {
    try {
      if (!sesionActiva()) {
        setState({
          user: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false,
          isDriver: false,
        });
        return;
      }

      // Validar token con el backend
      const isValid = await validarToken();

      if (isValid) {
        const session = obtenerSesion();
        const role = mapRolBackendToFrontend(session.rol);

        const user: User = {
          id: session.correo || 'unknown',
          name: extractNameFromEmail(session.correo || ''),
          email: session.correo || '',
          role,
        };

        setState({
          user,
          loading: false,
          isAuthenticated: true,
          isAdmin: role === 'admin',
          isDriver: role === 'driver',
        });
      } else {
        setState({
          user: null,
          loading: false,
          isAuthenticated: false,
          isAdmin: false,
          isDriver: false,
        });
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setState({
        user: null,
        loading: false,
        isAuthenticated: false,
        isAdmin: false,
        isDriver: false,
      });
    }
  };

  // ========================================
  // LOGIN
  // ========================================

  /**
   * Intenta hacer login con correo o cédula
   * @returns {LoginResult} Indica si requiere código de verificación
   */
  const login = async (
      identifier: string,
      password: string
  ): Promise<LoginResult> => {
    try {
      const result = await loginService({ identifier, password });

      // Caso 1: Login con correo (requiere código)
      if (result.requiresCode) {
        setCorreoTemporal(identifier);
        return {
          requiresCode: true,
          correo: identifier,
        };
      }

      // Caso 2: Login con cédula (directo)
      const response = result.response as { rol: string; correo: string };
      const role = mapRolBackendToFrontend(response.rol);

      const user: User = {
        id: response.correo,
        name: extractNameFromEmail(response.correo),
        email: response.correo,
        role,
      };

      setState({
        user,
        loading: false,
        isAuthenticated: true,
        isAdmin: role === 'admin',
        isDriver: role === 'driver',
      });

      return {
        requiresCode: false,
      };
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  // ========================================
  // VERIFICAR CÓDIGO
  // ========================================

  /**
   * Verifica el código de 6 dígitos (solo para login con correo)
   */
  const verifyCode = async (codigo: string): Promise<void> => {
    try {
      const response = await verificarCodigoService({
        correo: correoTemporal,
        codigo,
      });

      const role = mapRolBackendToFrontend(response.rol);

      const user: User = {
        id: response.correo,
        name: extractNameFromEmail(response.correo),
        email: response.correo,
        role,
      };

      setState({
        user,
        loading: false,
        isAuthenticated: true,
        isAdmin: role === 'admin',
        isDriver: role === 'driver',
      });

      setCorreoTemporal('');
    } catch (error) {
      console.error('Error al verificar código:', error);
      throw error;
    }
  };

  // ========================================
  // LOGOUT
  // ========================================

  const logout = () => {
    cerrarSesion();
    setState({
      user: null,
      loading: false,
      isAuthenticated: false,
      isAdmin: false,
      isDriver: false,
    });
  };

  // ========================================
  // CHECK AUTH (manual)
  // ========================================

  const checkAuth = async (): Promise<boolean> => {
    await checkAuthentication();
    return state.isAuthenticated;
  };

  return {
    ...state,
    login,
    verifyCode,
    logout,
    checkAuth,
  };
};

// ========================================
// HOOK useRequireAuth (protección de rutas)
// ========================================

/**
 * Hook para proteger rutas que requieren autenticación
 * Redirige a /login si no está autenticado
 *
 * @param requiredRole - Rol requerido ('admin' o 'driver')
 *
 * @example
 * ```tsx
 * function AdminPage() {
 *   const { loading, user } = useRequireAuth('admin');
 *
 *   if (loading) return <Loader />;
 *
 *   return <div>Dashboard Admin para {user?.name}</div>;
 * }
 * ```
 */
export const useRequireAuth = (requiredRole?: UserRole) => {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading) {
      // No autenticado → ir a login
      if (!auth.isAuthenticated) {
        navigate('/login', { replace: true });
        return;
      }

      // Autenticado pero sin el rol requerido → redirigir a su dashboard
      if (requiredRole && auth.user?.role !== requiredRole) {
        if (auth.user?.role === 'admin') {
          navigate('/dashboard', { replace: true });
        } else if (auth.user?.role === 'driver') {
          navigate('/driver-dashboard', { replace: true });
        }
      }
    }
  }, [auth.isAuthenticated, auth.loading, auth.user?.role, requiredRole, navigate]);

  return auth;
};

// ========================================
// COMPONENTE ProtectedRoute
// ========================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallback?: React.ReactNode;
}

/**
 * Componente para envolver rutas protegidas
 *
 * @example
 * ```tsx
 * <Route path="/dashboard" element={
 *   <ProtectedRoute requiredRole="admin">
 *     <Dashboard />
 *   </ProtectedRoute>
 * } />
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
                                                                children,
                                                                requiredRole,
                                                                fallback = (
                                                                    <div className="flex items-center justify-center min-h-screen">
                                                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                                                        </div>
                                                                ),
                                                              }) => {
  const { loading } = useRequireAuth(requiredRole);

  if (loading) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

// ========================================
// UTILIDADES (compatibilidad con código anterior)
// ========================================

/**
 * Verifica si hay una sesión activa (alias para compatibilidad)
 */
export const isLoggedIn = (): boolean => sesionActiva();

/**
 * Obtiene el rol actual (alias para compatibilidad)
 */
export const getCurrentRole = (): UserRole => {
  const session = obtenerSesion();
  return mapRolBackendToFrontend(session.rol);
};