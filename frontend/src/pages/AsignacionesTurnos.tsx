// frontend/src/pages/AsignacionesTurnos.tsx
// Página para asignar conductores a turnos (HU-5)

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { UserPlus, Search, AlertTriangle, X, Clock, Calendar } from 'lucide-react';
import { AssignShiftModal } from '@/components/modals/AssignShiftModal';
import {
    obtenerAsignaciones,
    cancelarAsignacion,
    formatearNombreConductor,
    formatearFecha,
    formatearDiaSemana,
    formatearHorario,
    obtenerColorEstado,
    type AsignacionTurno
} from '@/services/asignacionesService';
import { toast } from '@/hooks/use-toast';

export default function AsignacionesTurnos() {
    const [asignaciones, setAsignaciones] = useState<AsignacionTurno[]>([]);
    const [filteredAsignaciones, setFilteredAsignaciones] = useState<AsignacionTurno[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAsignaciones();
    }, []);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredAsignaciones(asignaciones);
        } else {
            const term = searchTerm.toLowerCase();
            const filtered = asignaciones.filter(
                (asig) =>
                    asig.conductor.nombre.toLowerCase().includes(term) ||
                    asig.conductor.apellido.toLowerCase().includes(term) ||
                    asig.conductor.cedula.includes(term) ||
                    asig.turno.ruta.nombre.toLowerCase().includes(term) ||
                    asig.estado.toLowerCase().includes(term)
            );
            setFilteredAsignaciones(filtered);
        }
    }, [searchTerm, asignaciones]);

    const loadAsignaciones = async () => {
        try {
            setLoading(true);
            const data = await obtenerAsignaciones();
            setAsignaciones(data);
            setFilteredAsignaciones(data);
        } catch (error: any) {
            console.error('Error loading asignaciones:', error);
            toast({
                variant: 'destructive',
                title: 'Error al cargar asignaciones',
                description: error.message || 'No se pudieron cargar las asignaciones'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (asignacion: AsignacionTurno) => {
        try {
            await cancelarAsignacion(asignacion.id);
            toast({
                title: 'Asignación cancelada',
                description: 'La asignación ha sido cancelada correctamente'
            });
            loadAsignaciones();
        } catch (error: any) {
            console.error('Error cancelando asignación:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message || 'No se pudo cancelar la asignación'
            });
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
                            Asignar Conductores a Turnos
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        Asigna conductores a las plantillas de turnos creadas para cada ruta.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search
                            className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            type="search"
                            placeholder="Buscar por conductor, ruta o estado..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-input"
                            aria-label="Buscar asignaciones"
                        />
                    </div>

                    <Button
                        onClick={() => setAssignModalOpen(true)}
                        className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
                        aria-label="Asignar conductor a turno"
                    >
                        <UserPlus className="h-4 w-4" aria-hidden="true" />
                        Asignar Conductor
                    </Button>
                </div>

                {/* Asignaciones Table */}
                <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-muted-foreground">
                            Cargando asignaciones...
                        </div>
                    ) : filteredAsignaciones.length === 0 ? (
                        <div className="p-8 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <UserPlus className="h-12 w-12 mb-2" />
                                <p className="font-medium">
                                    {searchTerm ? 'No se encontraron asignaciones' : 'No hay conductores asignados'}
                                </p>
                                {!searchTerm && (
                                    <p className="text-sm">
                                        Asigna conductores a los turnos para comenzar
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/30">
                                    <TableHead className="font-semibold text-foreground">CONDUCTOR</TableHead>
                                    <TableHead className="font-semibold text-foreground">RUTA</TableHead>
                                    <TableHead className="font-semibold text-foreground">DÍA / HORARIO</TableHead>
                                    <TableHead className="font-semibold text-foreground">FECHA INICIO</TableHead>
                                    <TableHead className="font-semibold text-foreground">ESTADO</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">ACCIONES</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAsignaciones.map((asignacion) => (
                                    <TableRow key={asignacion.id} className="hover:bg-muted/20">
                                        <TableCell className="font-medium text-foreground">
                                            <div>
                                                <div className="font-semibold">
                                                    {formatearNombreConductor(asignacion)}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Cédula: {asignacion.conductorId}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            <div>
                                                <div className="font-medium">
                                                    {asignacion.rutaNombre || asignacion.turno?.ruta?.nombre || 'Ruta desconocida'}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {asignacion.turno?.ruta?.origen && asignacion.turno?.ruta?.destino
                                                        ? `${asignacion.turno.ruta.origen} → ${asignacion.turno.ruta.destino}`
                                                        : 'Información no disponible'}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatearDiaSemana(asignacion.diaSemanaNombre || asignacion.turno?.diaSemana || '')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                                    <span className="text-sm">
                                                        {formatearHorario(asignacion)}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-foreground">
                                            {formatearFecha(asignacion.fechaInicio)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={obtenerColorEstado(asignacion.estado)}>
                                                {asignacion.estado}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(asignacion.estado === 'PROGRAMADA' || asignacion.estado === 'EN_CURSO') && (
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                                            aria-label={`Cancelar asignación de ${formatearNombreConductor(asignacion)}`}
                                                        >
                                                            <X className="h-4 w-4 mr-1" />
                                                            Cancelar
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent className="bg-card border-border">
                                                        <AlertDialogHeader>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="bg-red-100 p-2 rounded-full">
                                                                    <AlertTriangle className="h-5 w-5 text-destructive" />
                                                                </div>
                                                                <AlertDialogTitle className="text-lg font-semibold text-foreground">
                                                                    Cancelar Asignación
                                                                </AlertDialogTitle>
                                                            </div>
                                                            <AlertDialogDescription className="text-muted-foreground">
                                                                ¿Desea cancelar la asignación del conductor <strong>{formatearNombreConductor(asignacion)}</strong>
                                                                {' '}a la ruta <strong>{asignacion.rutaNombre || asignacion.turno?.ruta?.nombre || 'Ruta desconocida'}</strong>?
                                                                <br />
                                                                <span className="text-destructive font-medium mt-2 block">
                                  Esta acción no se puede deshacer.
                                </span>
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
                                                                No, mantener
                                                            </AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleCancelar(asignacion)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Sí, cancelar
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            )}
                                            {(asignacion.estado === 'FINALIZADA' || asignacion.estado === 'CANCELADA') && (
                                                <span className="text-sm text-muted-foreground">Sin acciones</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {!loading && filteredAsignaciones.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                        Mostrando {filteredAsignaciones.length} de {asignaciones.length} asignaciones
                    </div>
                )}
            </div>

            {/* Modal de Asignación */}
            <AssignShiftModal
                open={assignModalOpen}
                onOpenChange={setAssignModalOpen}
                onSuccess={loadAsignaciones}
            />
        </Layout>
    );
}