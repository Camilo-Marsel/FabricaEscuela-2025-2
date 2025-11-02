import { useState, useEffect, useCallback } from 'react';
import { journeyService, Journey, Route, NotificationSettings } from '@/services/mockJourneyService';
import { toast } from '@/hooks/use-toast';

export const useJourney = () => {
  const [journey, setJourney] = useState<Journey | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [notifications, setNotifications] = useState<NotificationSettings>({ email: true, push: true });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadJourneyData();
  }, []);

  // Update worked time every minute when journey is active
  useEffect(() => {
    if (!journey?.isActive) return;

    const interval = setInterval(() => {
      loadJourneyData();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [journey?.isActive]);

  const loadJourneyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [journeyData, routesData, notificationData] = await Promise.all([
        journeyService.getJourney(),
        journeyService.getAssignedRoutes(),
        journeyService.getNotificationSettings()
      ]);

      setJourney(journeyData);
      setRoutes(routesData);
      setNotifications(notificationData);
    } catch (err) {
      setError('Error al cargar los datos de la jornada');
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los datos de la jornada',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startJourney = useCallback(async () => {
    try {
      setLoading(true);
      const updatedJourney = await journeyService.startJourney();
      setJourney(updatedJourney);
      
      toast({
        title: 'Jornada iniciada',
        description: 'Tu jornada laboral ha comenzado exitosamente'
      });
    } catch (err) {
      setError('Error al iniciar la jornada');
      toast({
        title: 'Error',
        description: 'No se pudo iniciar la jornada',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const stopJourney = useCallback(async () => {
    try {
      setLoading(true);
      const updatedJourney = await journeyService.stopJourney();
      setJourney(updatedJourney);
      
      toast({
        title: 'Jornada finalizada',
        description: 'Tu jornada laboral ha terminado'
      });
    } catch (err) {
      setError('Error al finalizar la jornada');
      toast({
        title: 'Error',
        description: 'No se pudo finalizar la jornada',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNotificationSettings = useCallback(async (newSettings: NotificationSettings) => {
    try {
      const updated = await journeyService.updateNotificationSettings(newSettings);
      setNotifications(updated);
      
      toast({
        title: 'Configuración actualizada',
        description: 'Tus preferencias de notificaciones han sido guardadas'
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'No se pudieron guardar las preferencias',
        variant: 'destructive'
      });
    }
  }, []);

  return {
    journey,
    routes,
    notifications,
    loading,
    error,
    startJourney,
    stopJourney,
    updateNotificationSettings,
    refreshJourney: loadJourneyData
  };
};
