import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Search, AlertTriangle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AssignShiftModal } from '@/components/modals/AssignShiftModal';
import { getTurnos, deleteShift, type Turno } from '@/services/turnosService';
import { toast } from '@/hooks/use-toast';

export default function Turnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [filteredTurnos, setFilteredTurnos] = useState<Turno[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Turno | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTurnos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTurnos(turnos);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = turnos.filter(
        (turno) =>
          turno.driverName.toLowerCase().includes(term) ||
          turno.driverLicense.includes(term) ||
          turno.routeName.toLowerCase().includes(term)
      );
      setFilteredTurnos(filtered);
    }
  }, [searchTerm, turnos]);

  const loadTurnos = async () => {
    try {
      setLoading(true);
      const data = await getTurnos();
      setTurnos(data);
      setFilteredTurnos(data);
    } catch (error) {
      console.error('Error loading turnos:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los turnos'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (turno: Turno) => {
    try {
      const result = await deleteShift(turno.id);
      if (result.success) {
        toast({
          title: 'Turno eliminado',
          description: 'El turno ha sido eliminado correctamente'
        });
        loadTurnos();
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'No se pudo eliminar el turno'
        });
      }
    } catch (error) {
      console.error('Error deleting turno:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el turno'
      });
    }
  };

  const handleEdit = (turno: Turno) => {
    setEditingShift(turno);
    setShowAssignModal(true);
  };

  const handleAssignSuccess = () => {
    loadTurnos();
    setEditingShift(undefined);
  };

  const handleModalClose = (open: boolean) => {
    setShowAssignModal(open);
    if (!open) {
      setEditingShift(undefined);
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
              Gestión de turnos
            </h1>
          </div>
          <p className="text-muted-foreground">
            Administra y asigna turnos a conductores para las diferentes rutas.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-4 items-center">
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <Link to="/turnos">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Ver como Calendario
              </Link>
            </Button>
            
            <div className="relative w-full sm:w-96">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Buscar turnos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Buscar turnos por conductor o ruta"
              />
            </div>
          </div>
          
          <Button
            onClick={() => setShowAssignModal(true)}
            className="bg-primary hover:bg-primary-hover text-primary-foreground gap-2"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Asignar Turno
          </Button>
        </div>

        {/* Shifts Table */}
        <div className="border rounded-lg overflow-hidden bg-card">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">
              Cargando turnos...
            </div>
          ) : filteredTurnos.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {searchTerm ? 'No se encontraron turnos' : 'No hay turnos asignados'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>CÉDULA</TableHead>
                  <TableHead>CONDUCTOR</TableHead>
                  <TableHead>RUTA</TableHead>
                  <TableHead>FECHA DE INICIO</TableHead>
                  <TableHead>HORA DE INICIO</TableHead>
                  <TableHead className="text-right">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTurnos.map((turno) => (
                  <TableRow key={turno.id}>
                    <TableCell className="font-medium">
                      {turno.driverLicense}
                    </TableCell>
                    <TableCell>{turno.driverName}</TableCell>
                    <TableCell>{turno.routeName}</TableCell>
                    <TableCell>{turno.startDate}</TableCell>
                    <TableCell>{turno.startTime}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEdit(turno)}
                          aria-label={`Editar turno de ${turno.driverName}`}
                        >
                          Editar
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="destructive"
                              aria-label={`Eliminar turno de ${turno.driverName}`}
                            >
                              Eliminar
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <div className="flex justify-center mb-4">
                                <div className="bg-destructive/10 p-3 rounded-full">
                                  <AlertTriangle className="h-8 w-8 text-destructive" aria-hidden="true" />
                                </div>
                              </div>
                              <AlertDialogTitle className="text-center text-xl">
                                Eliminar Turno
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-center">
                                ¿Desea eliminar el turno asignado al conductor {turno.driverName} para la ruta {turno.routeName}?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="sm:justify-center">
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(turno)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <AssignShiftModal
        open={showAssignModal}
        onOpenChange={handleModalClose}
        onSuccess={handleAssignSuccess}
        editingShift={editingShift}
      />
    </Layout>
  );
}