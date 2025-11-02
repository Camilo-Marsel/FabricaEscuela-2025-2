/*import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Drivers from "./pages/Drivers";
import Turnos from "./pages/Turnos";
import TurnosCalendar from "./pages/TurnosCalendar";
import DriverNotifications from "./pages/DriverNotifications";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/turnos" element={<TurnosCalendar />} />
          <Route path="/turnos/table" element={<Turnos />} />
          <Route path="/driver-notifications" element={<DriverNotifications />} />
          <Route path="/driver-dashboard" element={<DriverDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE *//*}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
*/
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RoutesPage from "./pages/Routes";
import Drivers from "./pages/Drivers";
import Turnos from "./pages/Turnos";
import TurnosCalendar from "./pages/TurnosCalendar";
import DriverNotifications from "./pages/DriverNotifications";
import DriverDashboard from "./pages/DriverDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // 🔌 Probar conexión con backend al iniciar
  useEffect(() => {
    console.log('🚀 FleetGuard360 Frontend iniciado');
    console.log('📡 API URL:', import.meta.env.VITE_API_URL);

    // Verificar si el backend está disponible
    fetch(`${import.meta.env.VITE_API_URL}/rutas`)
        .then(res => {
          if (res.ok) {
            console.log('✅ Backend conectado correctamente');
          } else {
            console.warn('⚠️ Backend responde pero con error:', res.status);
          }
        })
        .catch(err => {
          console.error('❌ No se puede conectar al backend:', err.message);
          console.log('💡 Asegúrate de que el backend esté corriendo en http://localhost:8080');
        });
  }, []);

  return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/drivers" element={<Drivers />} />
              <Route path="/turnos" element={<TurnosCalendar />} />
              <Route path="/turnos/table" element={<Turnos />} />
              <Route path="/driver-notifications" element={<DriverNotifications />} />
              <Route path="/driver-dashboard" element={<DriverDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
  );
};

export default App;