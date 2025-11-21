// frontend/src/pages/DriverDashboard.tsx
import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { TurnoActualCard } from '@/components/driver/TurnoActualCard';
import { ProximosTurnosList } from '@/components/driver/ProximosTurnosList';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import {
  getMiInformacion,
  getMiTurnoActual,
  getMisProximosTurnos,
  iniciarTurno,
  finalizarTurno,
  type ConductorInfo,
  type TurnoActual,
  type ProximoTurno
} from '@/services/driverService';
import { clearAuth } from '@/services/api';

export default function DriverDashboard() {
  const navigate = useNavigate();

  // Estados
  const [conductorInfo, setConductorInfo] = useState<ConductorInfo | null>(null);
  const [turnoActual, setTurnoActual] = useState<TurnoActual | null>(null);
  const [proximosTurnos, setProximosTurnos] = useState<ProximoTurno[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Cargar datos en paralelo
      const [infoData, turnoData, turnosData] = await Promise.all([
        getMiInformacion(),
        getMiTurnoActual(),
        getMisProximosTurnos()
      ]);

      setConductorInfo(infoData);
      setTurnoActual(turnoData);
      setProximosTurnos(turnosData);

    } catch (err: any) {
      console.error('Error cargando dashboard:', err);
      setError(err.message || 'Error al cargar la información');

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la información del dashboard'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleIniciarTurno = async (asignacionId: number) => {
    try {
      setActionLoading(true);

      await iniciarTurno(asignacionId);

      toast({
        title: 'Turno iniciado',
        description: 'Has iniciado tu turno exitosamente',
        className: 'bg-green-50 border-green-200 text-green-800'
      });

      // Recargar datos
      await loadDashboardData();

    } catch (err: any) {
      console.error('Error iniciando turno:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'No se pudo iniciar el turno'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleFinalizarTurno = async (asignacionId: number) => {
    try {
      setActionLoading(true);

      await finalizarTurno(asignacionId);

      toast({
        title: 'Turno finalizado',
        description: 'Has finalizado tu turno exitosamente',
        className: 'bg-blue-50 border-blue-200 text-blue-800'
      });

      // Recargar datos
      await loadDashboardData();

    } catch (err: any) {
      console.error('Error finalizando turno:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.message || 'No se pudo finalizar el turno'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente'
    });
    navigate('/login');
  };

  // Pantalla de carga
  if (loading) {
    return (
        <Layout showLogin={false}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Cargando información...</p>
            </div>
          </div>
        </Layout>
    );
  }

  // Pantalla de error
  if (error && !conductorInfo) {
    return (
        <Layout showLogin={false}>
          <div className="flex items-center justify-center min-h-[60vh]">
            <Alert variant="destructive" className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
                <Button
                    onClick={loadDashboardData}
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                >
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </Layout>
    );
  }

  return (
      <Layout showLogin={false}>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Mi Dashboard
              </h1>
              <p className="text-muted-foreground">
                {conductorInfo?.nombreCompleto || conductorInfo?.username} - Conductor
              </p>
            </div>
            <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>

          {/* Layout Grid - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna principal - Turno actual */}
            <div className="lg:col-span-2 space-y-6">
              {turnoActual && (
                  <TurnoActualCard
                      turnoActual={turnoActual}
                      onIniciar={handleIniciarTurno}
                      onFinalizar={handleFinalizarTurno}
                      loading={actionLoading}
                  />
              )}

              {/* Próximos turnos (visible en mobile) */}
              <div className="lg:hidden">
                <ProximosTurnosList turnos={proximosTurnos} />
              </div>
            </div>

            {/* Columna lateral - Próximos turnos (visible en desktop) */}
            <div className="hidden lg:block">
              <ProximosTurnosList turnos={proximosTurnos} />
            </div>
          </div>
        </div>
      </Layout>
  );
}