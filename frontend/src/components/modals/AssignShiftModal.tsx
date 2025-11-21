// frontend/src/components/modals/AssignShiftModal.tsx
// Modal para asignar conductores a turnos (Flujo: Ruta → Turno → Conductor → Fecha)

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Calendar, MapPin } from 'lucide-react';
import { crearAsignacion, type AsignacionForm } from '@/services/asignacionesService';
import { obtenerTurnosPorRuta, formatearDiaSemana, type Turno } from '@/services/turnosService';
import { obtenerConductores, type Conductor } from '@/services/conductoresService';
import { rutasAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface AssignShiftModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Ruta {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
}

export const AssignShiftModal = ({ open, onOpenChange, onSuccess }: AssignShiftModalProps) => {
  // Estados para los selectores (flujo secuencial)
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [conductores, setConductores] = useState<Conductor[]>([]);

  const [selectedRuta, setSelectedRuta] = useState('');
  const [selectedTurno, setSelectedTurno] = useState('');
  const [selectedConductor, setSelectedConductor] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingTurnos, setLoadingTurnos] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    if (open) {
      loadInitialData();
      resetForm();
    }
  }, [open]);

  // Cargar turnos cuando se selecciona una ruta
  useEffect(() => {
    if (selectedRuta) {
      loadTurnosByRuta(parseInt(selectedRuta));
    } else {
      setTurnos([]);
      setSelectedTurno('');
    }
  }, [selectedRuta]);

  const loadInitialData = async () => {
    try {
      const [rutasData, conductoresData] = await Promise.all([
        rutasAPI.getAll(),
        obtenerConductores()
      ]);
      setRutas(rutasData);
      setConductores(conductoresData);

      // Establecer fecha por defecto (hoy)
      const today = new Date().toISOString().split('T')[0];
      setFechaInicio(today);
    } catch (err) {
      console.error('Error loading initial data:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo cargar la información necesaria'
      });
    }
  };

  const loadTurnosByRuta = async (rutaId: number) => {
    try {
      setLoadingTurnos(true);
      const turnosData = await obtenerTurnosPorRuta(rutaId);
      setTurnos(turnosData);

      if (turnosData.length === 0) {
        toast({
          title: 'Sin turnos disponibles',
          description: 'Esta ruta no tiene plantillas de turnos creadas',
          variant: 'destructive'
        });
      }
    } catch (err) {
      console.error('Error loading turnos:', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los turnos de esta ruta'
      });
      setTurnos([]);
    } finally {
      setLoadingTurnos(false);
    }
  };

  const resetForm = () => {
    setSelectedRuta('');
    setSelectedTurno('');
    setSelectedConductor('');
    const today = new Date().toISOString().split('T')[0];
    setFechaInicio(today);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!selectedRuta) {
      setError('Por favor seleccione una ruta');
      return;
    }

    if (!selectedTurno) {
      setError('Por favor seleccione un turno');
      return;
    }

    if (!selectedConductor) {
      setError('Por favor seleccione un conductor');
      return;
    }

    if (!fechaInicio) {
      setError('Por favor ingrese la fecha de inicio');
      return;
    }

    // Validación simplificada (sin revisar estado):
    const conductor = conductores.find(c => c.id === parseInt(selectedConductor));
    if (!conductor) {
      setError('El conductor seleccionado no existe');
      return;
    }

    setLoading(true);

    try {
      const asignacionData: AsignacionForm = {
        turnoId: parseInt(selectedTurno),
        conductorId: parseInt(selectedConductor),
        fechaInicio: fechaInicio
      };

      await crearAsignacion(asignacionData);

      toast({
        title: 'Asignación exitosa',
        description: 'El conductor ha sido asignado al turno correctamente',
        variant: 'default'
      });

      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error('Error creating assignment:', err);
      setError(err.message || 'Error al crear la asignación');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  // Obtener datos del turno seleccionado para mostrar detalles
  const turnoSeleccionado = turnos.find(t => t.id === parseInt(selectedTurno));
  const conductorSeleccionado = conductores.find(c => c.id === parseInt(selectedConductor));
  const rutaSeleccionada = rutas.find(r => r.id === parseInt(selectedRuta));

  const calcularDuracion = (horaInicio: string, horaFin: string): string => {
    const [horaIni, minIni] = horaInicio.split(':').map(Number);
    const [horaFin2, minFin] = horaFin.split(':').map(Number);

    const minutosInicio = horaIni * 60 + minIni;
    const minutosFin = horaFin2 * 60 + minFin;
    const duracionMinutos = minutosFin - minutosInicio;

    const horas = Math.floor(duracionMinutos / 60);
    const minutos = duracionMinutos % 60;

    if (minutos === 0) {
      return `${horas}h`;
    }
    return `${horas}h ${minutos}m`;
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[550px]" aria-describedby="assign-shift-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Asignar Conductor a Turno
            </DialogTitle>
          </DialogHeader>

          <p id="assign-shift-description" className="text-sm text-muted-foreground">
            Seleccione la ruta, turno y conductor para crear la asignación
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Paso 1: Seleccionar Ruta */}
            <div className="space-y-2">
              <Label htmlFor="ruta-select" className="text-sm font-semibold">
                1. Seleccionar Ruta
              </Label>
              <Select value={selectedRuta} onValueChange={setSelectedRuta}>
                <SelectTrigger id="ruta-select">
                  <SelectValue placeholder="Selecciona una ruta" />
                </SelectTrigger>
                <SelectContent>
                  {rutas.map((ruta) => (
                      <SelectItem key={ruta.id} value={ruta.id.toString()}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{ruta.nombre} ({ruta.origen} → {ruta.destino})</span>
                        </div>
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Paso 2: Seleccionar Turno */}
            <div className="space-y-2">
              <Label htmlFor="turno-select" className="text-sm font-semibold">
                2. Seleccionar Turno (Plantilla de Horario)
              </Label>
              <Select
                  value={selectedTurno}
                  onValueChange={setSelectedTurno}
                  disabled={!selectedRuta || loadingTurnos}
              >
                <SelectTrigger id="turno-select">
                  <SelectValue placeholder={
                    !selectedRuta
                        ? "Primero selecciona una ruta"
                        : loadingTurnos
                            ? "Cargando turnos..."
                            : "Selecciona un turno"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {turnos.length === 0 && !loadingTurnos ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No hay turnos disponibles para esta ruta
                      </div>
                  ) : (
                      turnos.map((turno) => (
                          <SelectItem key={turno.id} value={turno.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                          {formatearDiaSemana(turno.diaSemana)} - {turno.horaInicio} a {turno.horaFin}
                                {' '}({calcularDuracion(turno.horaInicio, turno.horaFin)})
                        </span>
                            </div>
                          </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>

              {/* Vista previa del turno seleccionado */}
              {turnoSeleccionado && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-sm">
                      <strong>Turno seleccionado:</strong><br />
                      Ruta: {rutaSeleccionada?.nombre}<br />
                      Día: {formatearDiaSemana(turnoSeleccionado.diaSemana)}<br />
                      Horario: {turnoSeleccionado.horaInicio} - {turnoSeleccionado.horaFin}<br />
                      Duración: {calcularDuracion(turnoSeleccionado.horaInicio, turnoSeleccionado.horaFin)}
                    </AlertDescription>
                  </Alert>
              )}
            </div>

            {/* Paso 3: Seleccionar Conductor */}
            <div className="space-y-2">
              <Label htmlFor="conductor-select" className="text-sm font-semibold">
                3. Seleccionar Conductor
              </Label>
              <Select
                  value={selectedConductor}
                  onValueChange={setSelectedConductor}
                  disabled={!selectedTurno}
              >
                <SelectTrigger id="conductor-select">
                  <SelectValue placeholder={
                    !selectedTurno
                        ? "Primero selecciona un turno"
                        : "Selecciona un conductor"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {conductores
                      .filter(c => !c.estado || c.estado === 'ACTIVO')
                      .map((conductor) => (
                          <SelectItem key={conductor.id} value={conductor.id.toString()}>
                            {conductor.nombre} {conductor.apellido} - {conductor.cedula}
                          </SelectItem>
                      ))}
                </SelectContent>
              </Select>

              {/* Advertencia si conductor inactivo */}

            </div>

            {/* Paso 4: Fecha de Inicio */}
            <div className="space-y-2">
              <Label htmlFor="fecha-inicio" className="text-sm font-semibold">
                4. Fecha de Inicio
              </Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                    id="fecha-inicio"
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={!selectedConductor}
                />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Botones de acción */}
            <div className="flex justify-end gap-2 pt-4 border-t">
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
                  disabled={loading || !selectedRuta || !selectedTurno || !selectedConductor || !fechaInicio}
                  className="bg-primary hover:bg-primary-hover"
              >
                {loading ? 'Asignando...' : 'Asignar Conductor'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};