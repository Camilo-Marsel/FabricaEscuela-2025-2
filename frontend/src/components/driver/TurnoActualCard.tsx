// frontend/src/components/driver/TurnoActualCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Calendar, Play, Square } from 'lucide-react';
import type { TurnoActual } from '@/services/driverService';

interface TurnoActualCardProps {
    turnoActual: TurnoActual;
    onIniciar?: (asignacionId: number) => void;
    onFinalizar?: (asignacionId: number) => void;
    loading?: boolean;
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
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

const getEstadoBadge = (estado: string) => {
    switch (estado) {
        case 'PROGRAMADA':
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Programada
                </Badge>
            );
        case 'EN_CURSO':
            return (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    En Curso
                </Badge>
            );
        case 'FINALIZADA':
            return (
                <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    Finalizada
                </Badge>
            );
        default:
            return <Badge variant="outline">{estado}</Badge>;
    }
};

export const TurnoActualCard = ({
                                    turnoActual,
                                    onIniciar,
                                    onFinalizar,
                                    loading = false
                                }: TurnoActualCardProps) => {
    // Si no tiene asignación hoy
    if (!turnoActual.tieneAsignacion) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-8">
                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Sin turno asignado hoy
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {turnoActual.mensaje || 'No tienes turno programado para hoy'}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const { asignacion } = turnoActual;
    if (!asignacion) return null;

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">Tu Turno de Hoy</CardTitle>
                    {getEstadoBadge(asignacion.estado)}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Información de la ruta */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 text-lg font-semibold">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span>{asignacion.rutaNombre}</span>
                    </div>

                    {/* Día y Fecha */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
              {formatearDia(asignacion.diaSemanaNombre)} - {formatearFecha(asignacion.fechaInicio)}
            </span>
                    </div>

                    {/* Horario */}
                    {asignacion.horarioTurno && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{asignacion.horarioTurno}</span>
                        </div>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-4">
                    {asignacion.estado === 'PROGRAMADA' && onIniciar && (
                        <Button
                            onClick={() => onIniciar(asignacion.id)}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            size="lg"
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Iniciar Turno
                        </Button>
                    )}

                    {asignacion.estado === 'EN_CURSO' && onFinalizar && (
                        <Button
                            onClick={() => onFinalizar(asignacion.id)}
                            disabled={loading}
                            variant="destructive"
                            className="flex-1"
                            size="lg"
                        >
                            <Square className="h-5 w-5 mr-2" />
                            Finalizar Turno
                        </Button>
                    )}

                    {asignacion.estado === 'FINALIZADA' && (
                        <div className="flex-1 text-center py-3 text-sm text-muted-foreground">
                            ✅ Turno completado
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
