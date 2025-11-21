// frontend/src/pages/Turnos.tsx
// Página de gestión de plantillas de turnos (HU-5) - CON MEJORAS UX

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Sparkles, Search, AlertTriangle, Trash2, Clock, Calendar } from 'lucide-react';
import { CreateTurnosModal } from '@/components/modals/CreateTurnosModal';
import { obtenerTurnos, eliminarTurno, formatearDiaSemana, obtenerColorEstado, type Turno } from '@/services/turnosService';
import { rutasAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface Ruta {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
}

export default function Turnos() {
  // Estados principales
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
  const [rutas, setRutas] = useState<Ruta[]>([]);

  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRuta, setSelectedRuta] = useState<string>('all');
  const [selectedSemana, setSelectedSemana] = useState<string>('all');

  // Estados de UI
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    loadTurnos();
    loadRutas();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = turnos;

    // Filtro de búsqueda
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
          (turno) =>
              turno.ruta.nombre.toLowerCase().includes(term) ||
              turno.ruta.origen.toLowerCase().includes(term) ||
              turno.ruta.destino.toLowerCase().includes(term) ||
              turno.diaSemana.toLowerCase().includes(term)
      );
    }

    // Filtro por ruta
    if (selectedRuta !== 'all') {
      filtered = filtered.filter(t => t.ruta.id === parseInt(selectedRuta));
    }

    // Filtro por semana
    if (selectedSemana !== 'all') {
      filtered = filtered.filter(t => t.numeroSemana === parseInt(selectedSemana));
    }

    setFilteredTurnos(filtered);
  }, [searchTerm, turnos, selectedRuta, selectedSemana]);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await obtenerTurnos();
      setTurnos(data);
      setFilteredTurnos(data);
    } catch (error: any) {
      console.error('Error loading turnos:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cargar turnos',
        description: error.message || 'No se pudieron cargar las plantillas de turnos'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRutas = async () => {
    try {
      const data = await rutasAPI.getAll();
      setRutas(data);
    } catch (error) {
      console.error('Error loading rutas:', error);
    }
  };

  const handleDelete = async (turno: Turno) => {
    try {
      await eliminarTurno(turno.id);
      toast({
        title: 'Turno eliminado',
        description: 'La plantilla de turno ha sido eliminada correctamente'
      });
      loadTurnos();
    } catch (error: any) {
      console.error('Error deleting turno:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'No se pudo eliminar el turno'
      });
    }
  };

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
      <Layout showLogin={false}>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <BackButton to="/dashboard" label="Volver al Dashboard" />
              <h1 className="text-3xl font-bold text-foreground">
                Plantillas de Turnos
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gestiona las plantillas de horarios que se asignarán a los conductores.
            </p>
          </div>

          {/* Filtros y Acciones */}
          <div className="space-y-4">
            {/* Selectores de filtro */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedRuta} onValueChange={setSelectedRuta}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Filtrar por ruta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las rutas</SelectItem>
                  {rutas.map((ruta) => (
                      <SelectItem key={ruta.id} value={ruta.id.toString()}>
                        {ruta.nombre}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSemana} onValueChange={setSelectedSemana}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por semana" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las semanas</SelectItem>
                  {Array.from({ length: 52 }, (_, i) => i + 1).map((semana) => (
                      <SelectItem key={semana} value={semana.toString()}>
                        Semana {semana}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Indicador de filtros activos */}
              {(selectedRuta !== 'all' || selectedSemana !== 'all') && (
                  <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRuta('all');
                        setSelectedSemana('all');
                      }}
                      className="h-10"
                  >
                    Limpiar filtros
                  </Button>
              )}
            </div>

            {/* Búsqueda y botón de crear */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                    className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                />
                <Input
                    type="search"
                    placeholder="Buscar por ruta, día..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-input"
                    aria-label="Buscar turnos"
                />
              </div>

              <Button
                  onClick={() => setCreateModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
                  aria-label="Crear turnos automáticamente"
              >
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Crear Turnos Automáticamente
              </Button>
            </div>
          </div>

          {/* Turnos Table */}
          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            {loading ? (
                <div className="p-8 text-center text-muted-foreground">
                  Cargando plantillas de turnos...
                </div>
            ) : filteredTurnos.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-2" />
                    <p className="font-medium">
                      {searchTerm || selectedRuta !== 'all' || selectedSemana !== 'all'
                          ? 'No se encontraron turnos con los filtros aplicados'
                          : 'No hay plantillas de turnos creadas'}
                    </p>
                    {!searchTerm && selectedRuta === 'all' && selectedSemana === 'all' && (
                        <p className="text-sm">
                          Crea turnos automáticamente para comenzar
                        </p>
                    )}
                  </div>
                </div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold text-foreground">RUTA</TableHead>
                      <TableHead className="font-semibold text-foreground">DÍA</TableHead>
                      <TableHead className="font-semibold text-foreground">HORARIO</TableHead>
                      <TableHead className="font-semibold text-foreground">DURACIÓN</TableHead>
                      <TableHead className="font-semibold text-foreground">SEMANA</TableHead>
                      <TableHead className="font-semibold text-foreground">ESTADO</TableHead>
                      <TableHead className="font-semibold text-foreground text-right">ACCIONES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTurnos.map((turno) => (
                        <TableRow key={turno.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium text-foreground">
                            <div>
                              <div className="font-semibold">{turno.ruta.nombre}</div>
                              <div className="text-sm text-muted-foreground">
                                {turno.ruta.origen} → {turno.ruta.destino}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {formatearDiaSemana(turno.diaSemana)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              {turno.horaInicio} - {turno.horaFin}
                            </div>
                          </TableCell>
                          <TableCell className="text-foreground">
                            {calcularDuracion(turno.horaInicio, turno.horaFin)}
                          </TableCell>
                          <TableCell className="text-foreground">
                            Semana {turno.numeroSemana}
                          </TableCell>
                          <TableCell>
                            <Badge className={obtenerColorEstado(turno.estado)}>
                              {turno.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                    aria-label={`Eliminar turno de ${turno.ruta.nombre}`}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Eliminar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-border">
                                <AlertDialogHeader>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-red-100 p-2 rounded-full">
                                      <AlertTriangle className="h-5 w-5 text-destructive" />
                                    </div>
                                    <AlertDialogTitle className="text-lg font-semibold text-foreground">
                                      Eliminar Plantilla de Turno
                                    </AlertDialogTitle>
                                  </div>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    ¿Desea eliminar la plantilla de turno de la ruta <strong>{turno.ruta.nombre}</strong>
                                    ({formatearDiaSemana(turno.diaSemana)}, {turno.horaInicio} - {turno.horaFin})?
                                    <br />
                                    <span className="text-destructive font-medium mt-2 block">
                                Esta acción no se puede deshacer.
                              </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                      onClick={() => handleDelete(turno)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
            )}
          </div>

          {/* Contador de resultados */}
          {!loading && filteredTurnos.length > 0 && (
              <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>
              Mostrando {filteredTurnos.length} de {turnos.length} plantillas de turnos
            </span>
                {(selectedRuta !== 'all' || selectedSemana !== 'all' || searchTerm) && (
                    <span className="text-blue-600 font-medium">
                (Filtros activos)
              </span>
                )}
              </div>
          )}
        </div>

        {/* Modal de Creación Automática */}
        <CreateTurnosModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onSuccess={loadTurnos}
        />
      </Layout>
  );
}