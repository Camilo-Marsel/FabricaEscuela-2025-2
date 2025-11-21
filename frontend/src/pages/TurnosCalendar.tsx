// frontend/src/pages/TurnosCalendar.tsx
// Vista de calendario para turnos (mock básico - pendiente implementación completa)

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, ChevronLeft, ChevronRight, Clock, MapPin, User } from 'lucide-react';
import { obtenerTurnos, formatearDiaSemana, type Turno } from '@/services/turnosService';
import { obtenerAsignaciones, type AsignacionTurno } from '@/services/asignacionesService';
import { toast } from '@/hooks/use-toast';

export default function TurnosCalendar() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [asignaciones, setAsignaciones] = useState<AsignacionTurno[]>([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [turnosData, asignacionesData] = await Promise.all([
        obtenerTurnos(),
        obtenerAsignaciones()
      ]);

      // Filtrar por semana actual
      const turnosFiltrados = turnosData.filter(t => t.numeroSemana === currentWeek);
      setTurnos(turnosFiltrados);
      setAsignaciones(asignacionesData);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        variant: 'destructive',
        title: 'Error al cargar datos',
        description: error.message || 'No se pudieron cargar los turnos'
      });
    } finally {
      setLoading(false);
    }
  };

  const diasSemana = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'];

  const obtenerTurnosPorDia = (dia: string) => {
    return turnos.filter(t => t.diaSemana === dia);
  };

  const obtenerAsignacionPorTurno = (turnoId: number) => {
    return asignaciones.find(a => a.turno.id === turnoId);
  };

  const handlePreviousWeek = () => {
    if (currentWeek > 1) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeek < 52) {
      setCurrentWeek(currentWeek + 1);
    }
  };

  return (
      <Layout showLogin={false}>
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <BackButton to="/dashboard" label="Volver al Dashboard" />
              <h1 className="text-3xl font-bold text-foreground">
                Calendario de Turnos
              </h1>
            </div>
            <p className="text-muted-foreground">
              Vista semanal de turnos y asignaciones de conductores.
            </p>
          </div>

          {/* Week Navigation */}
          <Card className="border-border">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousWeek}
                    disabled={currentWeek === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>

                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Semana {currentWeek}
                </CardTitle>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextWeek}
                    disabled={currentWeek === 52}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Calendar Grid */}
          {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                Cargando calendario...
              </div>
          ) : turnos.length === 0 ? (
              <Card className="border-border">
                <CardContent className="py-12">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Calendar className="h-12 w-12 mb-2" />
                    <p className="font-medium">No hay turnos para la semana {currentWeek}</p>
                    <p className="text-sm">
                      Crea plantillas de turnos desde la vista de gestión
                    </p>
                  </div>
                </CardContent>
              </Card>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                {diasSemana.map((dia) => {
                  const turnosDia = obtenerTurnosPorDia(dia);

                  return (
                      <Card key={dia} className="border-border">
                        <CardHeader className="pb-3 bg-muted/30">
                          <CardTitle className="text-sm font-semibold text-center">
                            {formatearDiaSemana(dia)}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 pt-4">
                          {turnosDia.length === 0 ? (
                              <p className="text-xs text-muted-foreground text-center py-4">
                                Sin turnos
                              </p>
                          ) : (
                              turnosDia.map((turno) => {
                                const asignacion = obtenerAsignacionPorTurno(turno.id);

                                return (
                                    <div
                                        key={turno.id}
                                        className="p-3 rounded-lg border border-border bg-card hover:bg-muted/20 transition-colors"
                                    >
                                      {/* Ruta */}
                                      <div className="flex items-start gap-2 mb-2">
                                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-semibold text-foreground truncate">
                                            {turno.ruta.nombre}
                                          </p>
                                          <p className="text-xs text-muted-foreground truncate">
                                            {turno.ruta.origen} → {turno.ruta.destino}
                                          </p>
                                        </div>
                                      </div>

                                      {/* Horario */}
                                      <div className="flex items-center gap-2 mb-2">
                                        <Clock className="h-3 w-3 text-muted-foreground" />
                                        <p className="text-xs text-muted-foreground">
                                          {turno.horaInicio} - {turno.horaFin}
                                        </p>
                                      </div>

                                      {/* Conductor asignado */}
                                      {asignacion ? (
                                          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border">
                                            <User className="h-3 w-3 text-green-600" />
                                            <p className="text-xs font-medium text-green-700 truncate">
                                              {asignacion.conductor.nombre} {asignacion.conductor.apellido}
                                            </p>
                                          </div>
                                      ) : (
                                          <Badge variant="outline" className="mt-2 text-xs">
                                            Sin asignar
                                          </Badge>
                                      )}
                                    </div>
                                );
                              })
                          )}
                        </CardContent>
                      </Card>
                  );
                })}
              </div>
          )}

          {/* Info Footer */}
          <Card className="border-border bg-blue-50">
            <CardContent className="py-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Nota:</strong> Esta es una vista de solo lectura. Para crear turnos o asignar conductores,
                usa las opciones desde el Dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
}