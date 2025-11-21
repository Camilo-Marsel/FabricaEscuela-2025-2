// frontend/src/components/modals/CreateTurnosModal.tsx
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, CheckCircle2, Sparkles, Clock, AlertTriangle } from 'lucide-react';
import { turnosAPI, rutasAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface CreateTurnosModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export const CreateTurnosModal = ({ open, onOpenChange, onSuccess }: CreateTurnosModalProps) => {
    const { toast } = useToast();

    // Estados del formulario
    const [rutas, setRutas] = useState<any[]>([]);
    const [rutaId, setRutaId] = useState<string>('');
    const [horaInicio, setHoraInicio] = useState('06:00');
    const [horaFin, setHoraFin] = useState('22:00');
    const [numeroSemana, setNumeroSemana] = useState('1');

    // Estados de UI
    const [loading, setLoading] = useState(false);
    const [loadingPreview, setLoadingPreview] = useState(false);
    const [error, setError] = useState('');
    const [preview, setPreview] = useState<any>(null);

    useEffect(() => {
        if (open) {
            cargarRutas();
        }
    }, [open]);

    useEffect(() => {
        if (rutaId && horaInicio && horaFin) {
            cargarPrevisualización();
        }
    }, [rutaId, horaInicio, horaFin, numeroSemana]);

    const cargarRutas = async () => {
        try {
            const data = await rutasAPI.getAll();
            setRutas(data);
        } catch (err: any) {
            console.error('Error al cargar rutas:', err);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudieron cargar las rutas'
            });
        }
    };

    const cargarPrevisualización = async () => {
        if (!rutaId) return;

        try {
            setLoadingPreview(true);
            setError('');
            const data = await turnosAPI.previsualizarAuto(
                parseInt(rutaId),
                horaInicio,
                horaFin,
                parseInt(numeroSemana)
            );
            setPreview(data);
        } catch (err: any) {
            console.error('Error en previsualización:', err);
            setPreview(null);
            setError(err.message || 'Error al generar previsualización');
        } finally {
            setLoadingPreview(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!rutaId) {
            setError('Selecciona una ruta');
            return;
        }

        setLoading(true);

        try {
            const response = await turnosAPI.createAuto(
                parseInt(rutaId),
                horaInicio,
                horaFin,
                parseInt(numeroSemana)
            );

            toast({
                title: 'Turnos creados exitosamente',
                description: `Se crearon ${response.totalTurnos} turnos (${response.turnosPorDia} por día)`,
            });

            onSuccess();
            handleClose();
        } catch (err: any) {
            console.error('Error al crear turnos:', err);
            setError(err.message || 'Error al crear turnos automáticamente');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRutaId('');
        setHoraInicio('06:00');
        setHoraFin('22:00');
        setNumeroSemana('1');
        setPreview(null);
        setError('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <Sparkles className="h-6 w-6 text-blue-600" />
                        Crear Turnos Automáticamente
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Configuración */}
                    <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-lg">Configuración</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label htmlFor="ruta">Ruta *</Label>
                                <Select value={rutaId} onValueChange={setRutaId}>
                                    <SelectTrigger id="ruta">
                                        <SelectValue placeholder="Selecciona una ruta" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {rutas.map((ruta) => (
                                            <SelectItem key={ruta.id} value={ruta.id.toString()}>
                                                {ruta.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="horaInicio">Hora Inicio</Label>
                                <Input
                                    id="horaInicio"
                                    type="time"
                                    value={horaInicio}
                                    onChange={(e) => setHoraInicio(e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="horaFin">Hora Fin</Label>
                                <Input
                                    id="horaFin"
                                    type="time"
                                    value={horaFin}
                                    onChange={(e) => setHoraFin(e.target.value)}
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="semana">Semana</Label>
                                <Select value={numeroSemana} onValueChange={setNumeroSemana}>
                                    <SelectTrigger id="semana">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[1, 2, 3, 4].map((num) => (
                                            <SelectItem key={num} value={num.toString()}>
                                                Semana {num}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Previsualización */}
                    {loadingPreview && (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2">Calculando turnos...</span>
                        </div>
                    )}

                    {preview && !loadingPreview && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                <h3 className="font-semibold text-lg">Vista Previa</h3>
                            </div>

                            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Ruta:</span>
                                    <Badge variant="outline">{preview.rutaNombre}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Horario:</span>
                                    <span className="font-mono">{preview.horaInicio} - {preview.horaFin}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Turnos por día:</span>
                                    <Badge>{preview.turnosPorDia} turnos</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total turnos:</span>
                                    <Badge className="bg-blue-600 text-white">{preview.totalTurnos} turnos</Badge>
                                </div>
                            </div>

                            {/* Muestra de turnos */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium">Ejemplo de turnos (día completo):</p>
                                <div className="space-y-2">
                                    {preview.turnosMuestra.map((turno: any, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded border"
                                        >
                                            <Clock className="h-4 w-4 text-blue-600" />
                                            <span className="font-mono text-sm">
                        {turno.horaInicio} - {turno.horaFin}
                      </span>
                                            <Badge variant="secondary">{turno.duracionHoras}h</Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Advertencia de horas restantes */}
                            {preview.advertencia && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>
                                        <p className="font-semibold mb-1">Horas sin cubrir</p>
                                        <p>{preview.advertencia}</p>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {!preview.advertencia && (
                                <Alert className="bg-green-50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        ✨ Perfecto! Todos los turnos son de 8 horas completas.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Botones */}
                    <div className="flex gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading || !preview || loadingPreview}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creando...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Crear {preview?.totalTurnos || 0} Turnos
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};