// frontend/src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Importar páginas
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Drivers from "./pages/Drivers";
import Turnos from "./pages/Turnos";
import TurnosCalendar from "./pages/TurnosCalendar";
import AsignacionesTurnos from "./pages/AsignacionesTurnos.tsx";
import DriverNotifications from "./pages/DriverNotifications";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";

// Importar componentes
import { ProtectedRoute } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const queryClient = new QueryClient();

// Configuración de la URL de la API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const App = () => {
    // 🔌 Verificar conexión con backend al iniciar
    useEffect(() => {
        console.log('🚀 FleetGuard360 Frontend iniciado');
        console.log('📡 API URL:', API_URL);

        // Test de conexión al backend usando el endpoint público /health
        fetch(`${API_URL}/health`)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw new Error(`HTTP ${res.status}`);
                }
            })
            .then(data => {
                console.log('✅ Backend conectado correctamente:', data);
            })
            .catch(err => {
                console.error('❌ No se puede conectar al backend:', err.message);
                console.log('💡 Asegúrate de que el backend esté corriendo en', API_URL);
            });
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        {/* Rutas públicas */}
                        <Route path="/" element={<Index />} />
                        <Route path="/login" element={<Login />} />

                        {/* Rutas de Admin (protegidas) */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute requiredRole="admin" fallback={<LoadingSpinner />}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/routes"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <RoutesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/drivers"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <Drivers />
                                </ProtectedRoute>
                            }
                        />

                        {/* Rutas de Turnos */}
                        <Route
                            path="/turnos"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <Turnos />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/turnos/calendario"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <TurnosCalendar />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/asignaciones"
                            element={
                                <ProtectedRoute requiredRole="admin">
                                    <AsignacionesTurnos />
                                </ProtectedRoute>
                            }
                        />

                        {/* Rutas de Conductor (protegidas) */}
                        <Route
                            path="/driver-dashboard"
                            element={
                                <ProtectedRoute requiredRole="driver">  {/* ⭐ CAMBIAR driver → CONDUCTOR */}
                                    <DriverDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/driver-notifications"
                            element={
                                <ProtectedRoute requiredRole="driver">  {/* ⭐ CAMBIAR driver → CONDUCTOR */}
                                    <DriverNotifications />
                                </ProtectedRoute>
                            }
                        />

                        {/* Redirecciones de rutas antiguas .html */}
                        <Route path="/dashboard.html" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/admin-dashboard.html" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/driver-dashboard.html" element={<Navigate to="/driver-dashboard" replace />} />

                        {/* 404 - Debe ser la última ruta */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;