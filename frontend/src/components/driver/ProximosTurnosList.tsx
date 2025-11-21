// frontend/src/components/driver/ProximosTurnosList.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin } from 'lucide-react';
import type { ProximoTurno } from '@/services/driverService';

interface ProximosTurnosListProps {
    turnos: ProximoTurno[];
}

const formatearDia = (dia: string): string => {
    const dias: Record<string, string> = {
        'MONDAY': 'Lunes',
        'TUESDAY': 'Martes',
        'WEDNESDAY': 'Miércoles',
        'THURSDAY': 'Jueves',
        'FRIDAY': 'Viernes',
        'SATURDAY': 'Sábado',
        'SUNDAY': 'Domingo'
    };
    return dias[dia] || dia;
};

const formatearFecha = (fecha: string): string => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
    });
};

const formatearFechaCompleta = (fecha: string): string => {
    const date = new Date(fecha + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    });
};

export const ProximosTurnosList = ({ turnos }: ProximosTurnosListProps) => {
    if (turnos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Próximos Turnos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-sm text-muted-foreground">
                            No tienes turnos programados para los próximos 7 días
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">Próximos Turnos</CardTitle>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {turnos.length} {turnos.length === 1 ? 'turno' : 'turnos'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {turnos.map((turno) => (
                        <div
                            key={turno.id}
                            className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                        >
                            {/* Fecha destacada */}
                            <div className="flex flex-col items-center justify-center min-w-[60px] p-2 bg-primary/10 rounded-lg">
                <span className="text-xs font-medium text-primary uppercase">
                  {formatearDia(turno.diaSemanaNombre).slice(0, 3)}
                </span>
                                <span className="text-lg font-bold text-primary">
                  {formatearFecha(turno.fechaInicio)}
                </span>
                            </div>

                            {/* Información del turno */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                                    <span className="font-semibold text-foreground truncate">
                    {turno.rutaNombre}
                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                                    <Calendar className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">
                    {formatearFechaCompleta(turno.fechaInicio)}
                  </span>
                                </div>

                                {turno.horarioTurno && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3 flex-shrink-0" />
                                        <span>{turno.horarioTurno}</span>
                                    </div>
                                )}
                            </div>

                            {/* Estado */}
                            <div className="flex-shrink-0">
                                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                                    {turno.estado === 'ASIGNADA' ? 'Pendiente' : turno.estado}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
