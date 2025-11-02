import { useEffect, useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Activity, CheckCircle2, AlertCircle, Calendar, Square, Circle } from 'lucide-react';
import { useJourney } from '@/hooks/useJourney';
import { journeyService } from '@/services/mockJourneyService';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DriverDashboard() {
  const { journey, routes, loading, stopJourney } = useJourney();
  const navigate = useNavigate();
  const [driverInfo, setDriverInfo] = useState<{ name: string; license: string } | null>(null);

  useEffect(() => {
    // Load driver info
    journeyService.getDriverInfo().then(info => {
      setDriverInfo({ name: info.name, license: info.license });
    });
  }, []);

  // Redirect to notifications if journey is not active
  useEffect(() => {
    if (journey && !journey.isActive) {
      navigate('/driver-notifications');
    }
  }, [journey, navigate]);

  if (loading || !journey || !driverInfo) {
    return (
      <Layout showLogin={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Layout>
    );
  }

  const totalMinutes = journey.totalHours * 60;
  const workedMinutes = journey.workedHours * 60 + journey.workedMinutes;
  const progressPercentage = (workedMinutes / totalMinutes) * 100;
  const remainingMinutes = totalMinutes - workedMinutes;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  
  // Check if journey is about to end (less than 30 minutes remaining)
  const isJourneyEndingSoon = remainingMinutes <= 30 && remainingMinutes > 0;

  const handleEndJourney = async () => {
    await stopJourney();
    toast({
      title: 'Jornada finalizada',
      description: 'Tu jornada laboral ha terminado exitosamente.',
      className: 'bg-success/10 border-success/20 text-success'
    });
    navigate('/driver-notifications');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="outline" className="gap-1 bg-success/10 text-success border-success/20">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            Completada
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="gap-1 bg-warning/10 text-warning border-warning/20">
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
            En Progreso
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge variant="outline" className="gap-1 bg-primary/10 text-primary border-primary/20">
            <Calendar className="h-3 w-3" aria-hidden="true" />
            Programada
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Layout showLogin={false}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Mi Jornada Laboral</h1>
              <p className="text-muted-foreground">
                {driverInfo.name} - Conductor {driverInfo.license}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-success/10 border border-success/20 rounded-lg">
                <Circle className="h-3 w-3 fill-success text-success animate-pulse" aria-hidden="true" />
                <span className="text-sm font-medium text-success">En servicio</span>
              </div>
              <Button
                onClick={handleEndJourney}
                variant="destructive"
                className="gap-2"
                aria-label="Finalizar jornada laboral"
              >
                <Square className="h-4 w-4" aria-hidden="true" />
                Finalizar Jornada
              </Button>
            </div>
          </div>
        </div>

        {/* Journey Ending Soon Alert */}
        {isJourneyEndingSoon && (
          <Alert className="bg-warning/10 border-warning/20">
            <AlertCircle className="h-5 w-5 text-warning" />
            <AlertDescription className="text-warning">
              <span className="font-semibold">Atención:</span> Tu jornada laboral está por finalizar. 
              Solo quedan {remainingHours}h {remainingMins}m de trabajo. Prepárate para concluir tus actividades.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Summary Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Jornada Laboral de Hoy
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {new Date().toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                  {/* Start Time */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hora de inicio de jornada</p>
                    <p className="text-lg font-semibold text-success flex items-center gap-2">
                      <Activity className="h-5 w-5" aria-hidden="true" />
                      {journey.startTime} a.m.
                    </p>
                  </div>

                  {/* Estimated End Time */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hora proyectada de finalización</p>
                    <p className="text-lg font-semibold text-warning flex items-center gap-2">
                      <Clock className="h-5 w-5" aria-hidden="true" />
                      {journey.estimatedEndTime.split(':')[0]}:00 p.m.
                    </p>
                  </div>

                   {/* Time Remaining */}
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Tiempo restante</p>
                     <p className="text-lg font-semibold text-warning flex items-center gap-2">
                       <Clock className="h-5 w-5" aria-hidden="true" />
                       {remainingHours}h {remainingMins}m
                     </p>
                   </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Progreso de la jornada</p>
                  <Progress 
                    value={progressPercentage} 
                    className="h-3"
                    aria-label={`Progreso de jornada: ${Math.round(progressPercentage)}%`}
                  />
                  <p className="text-sm text-muted-foreground text-right">
                    {journey.workedHours}h {journey.workedMinutes}m / {journey.totalHours}h ({Math.round(progressPercentage)}%)
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Routes */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Rutas Asignadas para Hoy</h2>
          <div className="space-y-4">
            {routes.map((route) => (
              <Card key={route.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {route.id} - {route.name}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {route.origin} → {route.destination}
                      </p>
                    </div>
                    {getStatusBadge(route.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Inicio</p>
                      <p className="text-sm font-semibold text-foreground">
                        {route.startTime} a.m.
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Finalización</p>
                      <p className="text-sm font-semibold text-foreground">
                        {route.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Duración</p>
                      <p className="text-sm font-semibold text-foreground">{route.duration}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Distancia</p>
                      <p className="text-sm font-semibold text-foreground">{route.distance}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
