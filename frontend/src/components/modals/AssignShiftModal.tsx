import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { assignShift, editShift, getDrivers, getRoutes, type Driver, type Route, type Turno } from '@/services/turnosService';
import { toast } from '@/hooks/use-toast';

interface AssignShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  editingShift?: Turno;
}

export const AssignShiftModal = ({ open, onOpenChange, onSuccess, editingShift }: AssignShiftModalProps) => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedRoute, setSelectedRoute] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadData();
      if (editingShift) {
        setSelectedDriver(editingShift.driverId);
        setSelectedRoute(editingShift.routeId);
        setStartDate(editingShift.startDate);
        setStartTime(editingShift.startTime);
      } else {
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        setStartDate(today);
        setStartTime('08:00');
      }
      setError('');
    }
  }, [open, editingShift]);

  const loadData = async () => {
    try {
      const [driversData, routesData] = await Promise.all([
        getDrivers(),
        getRoutes()
      ]);
      setDrivers(driversData);
      setRoutes(routesData);
    } catch (err) {
      console.error('Error loading data:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la información necesaria'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedDriver || !selectedRoute || !startDate || !startTime) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);

    try {
      const result = editingShift
        ? await editShift(editingShift.id, selectedDriver, selectedRoute, startDate, startTime)
        : await assignShift(selectedDriver, selectedRoute, startDate, startTime);

      if (result.success) {
        toast({
          title: editingShift ? 'Turno actualizado' : 'Turno asignado',
          description: editingShift 
            ? 'El turno ha sido actualizado correctamente'
            : 'El turno ha sido asignado correctamente'
        });
        onSuccess();
        handleClose();
      } else {
        setError(result.error || 'Error al procesar la solicitud');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDriver('');
    setSelectedRoute('');
    setStartDate('');
    setStartTime('');
    setError('');
    onOpenChange(false);
  };

  const selectedDriverData = drivers.find(d => d.id === selectedDriver);
  const isDriverInactive = selectedDriverData?.status === 'inactive';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" aria-describedby="assign-shift-description">
        <DialogHeader>
          <DialogTitle>
            {editingShift ? 'Editar Turno' : 'Asignar Nuevo Turno'}
          </DialogTitle>
        </DialogHeader>
        
        <p id="assign-shift-description" className="sr-only">
          {editingShift 
            ? 'Formulario para editar un turno existente' 
            : 'Formulario para asignar un nuevo turno a un conductor'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="driver-select">Seleccionar Conductor</Label>
            <Select value={selectedDriver} onValueChange={setSelectedDriver}>
              <SelectTrigger id="driver-select">
                <SelectValue placeholder="Selecciona un conductor" />
              </SelectTrigger>
              <SelectContent>
                {drivers.map((driver) => (
                  <SelectItem key={driver.id} value={driver.id}>
                    {driver.name} {driver.status === 'inactive' ? '(Inactivo)' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isDriverInactive && (
              <Alert variant="destructive" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  El conductor seleccionado no se encuentra en estado 'activo'
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="route-select">Seleccionar Ruta</Label>
            <Select value={selectedRoute} onValueChange={setSelectedRoute}>
              <SelectTrigger id="route-select">
                <SelectValue placeholder="Selecciona una ruta" />
              </SelectTrigger>
              <SelectContent>
                {routes.map((route) => (
                  <SelectItem key={route.id} value={route.id}>
                    {route.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Fecha de Inicio</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-time">Hora de Inicio</Label>
              <Input
                id="start-time"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || isDriverInactive}
              className="bg-destructive hover:bg-destructive/90"
            >
              {loading ? 'Procesando...' : (editingShift ? 'Guardar Cambios' : 'Asignar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};