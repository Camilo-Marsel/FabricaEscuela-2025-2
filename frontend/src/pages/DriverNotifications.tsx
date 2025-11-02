import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Clock, Play, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useJourney } from '@/hooks/useJourney';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export default function DriverNotifications() {
  const { journey, notifications, loading, startJourney, stopJourney, updateNotificationSettings } = useJourney();
  const navigate = useNavigate();
  const [localNotifications, setLocalNotifications] = useState(notifications);

  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  // Redirect to dashboard if journey is already active
  useEffect(() => {
    if (journey?.isActive) {
      navigate('/driver-dashboard');
    }
  }, [journey?.isActive, navigate]);

  const handleStartJourney = async () => {
    await startJourney();
    toast({
      title: 'Jornada iniciada',
      description: 'Tu jornada laboral ha comenzado exitosamente.',
      className: 'bg-success/10 border-success/20 text-success'
    });
  };

  const handleSaveNotifications = async () => {
    await updateNotificationSettings(localNotifications);
  };

  if (loading) {
    return (
      <Layout showLogin={false}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </Layout>
    );
  }

  const totalMinutes = (journey?.totalHours || 8) * 60;
  const workedMinutes = (journey?.workedHours || 0) * 60 + (journey?.workedMinutes || 0);
  const progressPercentage = (workedMinutes / totalMinutes) * 100;
  const remainingMinutes = totalMinutes - workedMinutes;
  const remainingHours = Math.floor(remainingMinutes / 60);
  const remainingMins = remainingMinutes % 60;
  
  // Check if journey is about to end (less than 30 minutes remaining)
  const isJourneyEndingSoon = journey?.isActive && remainingMinutes <= 30 && remainingMinutes > 0;

  return (
    <Layout showLogin={false}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Notificaciones de Jornada</h1>
          <div className="px-4 py-2 bg-muted rounded-lg">
            <span className="text-sm font-medium text-muted-foreground">Conductor</span>
          </div>
        </div>

        {/* Journey About to End Alert */}
        {isJourneyEndingSoon && (
          <Alert className="bg-warning/10 border-warning/20">
            <AlertCircle className="h-5 w-5 text-warning" />
            <AlertDescription className="text-warning">
              <span className="font-semibold">Atención:</span> Tu jornada laboral está por finalizar. 
              Solo quedan {remainingHours}h {remainingMins}m de trabajo.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Start Alert */}
        {!journey?.isActive && (
          <Alert className="bg-primary/10 border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <AlertDescription className="text-primary">
              <span className="font-semibold">Listo para comenzar:</span> Tu jornada laboral está programada para hoy. 
              Presiona "Iniciar Jornada" cuando estés listo.
            </AlertDescription>
          </Alert>
        )}

        {/* Journey Alert Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Alerta de Jornada Laboral
                </h2>
                <p className="text-muted-foreground">
                  {journey?.isActive 
                    ? `Tu jornada laboral está por finalizar. Has trabajado ${journey.workedHours}h ${journey.workedMinutes}m.`
                    : 'Tu jornada laboral está por iniciar. Has trabajado 0h 0m.'}
                </p>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground">
                  Tiempo trabajado: {journey?.workedHours || 0}h {journey?.workedMinutes || 0}m
                </span>
                <span className="font-medium text-warning">
                  Tiempo restante: {remainingHours}h {remainingMins}m
                </span>
              </div>
              <Progress 
                value={progressPercentage} 
                className="h-2"
                aria-label={`Progreso de jornada: ${Math.round(progressPercentage)}%`}
              />
            </div>

            {/* Journey Control Button */}
            <div className="mt-6 flex justify-center">
              {!journey?.isActive ? (
                <Button
                  onClick={handleStartJourney}
                  size="lg"
                  className="gap-2"
                  aria-label="Iniciar jornada laboral"
                >
                  <Play className="h-5 w-5" aria-hidden="true" />
                  Iniciar Jornada
                </Button>
              ) : (
                <Button
                  onClick={stopJourney}
                  variant="destructive"
                  size="lg"
                  className="gap-2"
                  aria-label="Finalizar jornada laboral"
                >
                  <Square className="h-5 w-5" aria-hidden="true" />
                  Finalizar Jornada
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Notificaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="email-notifications"
                checked={localNotifications.email}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, email: checked as boolean })
                }
                aria-describedby="email-notifications-description"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="email-notifications"
                  className="text-base font-medium cursor-pointer"
                >
                  Recibir por correo
                </Label>
                <p id="email-notifications-description" className="text-sm text-muted-foreground">
                  Enviaremos alertas a tu correo registrado
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="push-notifications"
                checked={localNotifications.push}
                onCheckedChange={(checked) =>
                  setLocalNotifications({ ...localNotifications, push: checked as boolean })
                }
                aria-describedby="push-notifications-description"
              />
              <div className="space-y-1">
                <Label
                  htmlFor="push-notifications"
                  className="text-base font-medium cursor-pointer"
                >
                  Recibir en la aplicación
                </Label>
                <p id="push-notifications-description" className="text-sm text-muted-foreground">
                  Mostrar notificaciones push en tiempo real
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setLocalNotifications(notifications)}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveNotifications}>
                Guardar Cambios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
