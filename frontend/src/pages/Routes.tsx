import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/BackButton";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CreateRouteModal } from "@/components/modals/CreateRouteModal";
import { EditRouteModal } from "@/components/modals/EditRouteModal";
import { Search, Plus, Edit, Trash2, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { rutasAPI } from "@/services/api";

interface Route {
  id: number;
  codigo?: string;
  nombre: string;
  origen?: string;
  destino?: string;
  duracionEnMinutos?: number;
  description?: string;
}

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const { toast } = useToast();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await rutasAPI.getAll();
      setRoutes(data);
    } catch (error: any) {
      console.error('Error cargando rutas:', error);
      toast({
        title: "Error al cargar rutas",
        description: error.message || "No se pudo conectar con el servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRoutes = routes.filter(route =>
      route.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (route: Route) => {
    setSelectedRoute(route);
    setEditModalOpen(true);
  };

  const handleDelete = async (routeId: number, routeName: string) => {
    try {
      await rutasAPI.delete(routeId);
      toast({
        title: "Ruta eliminada",
        description: `La ruta ${routeName} ha sido eliminada del sistema.`,
        variant: "destructive",
      });
      loadRoutes();
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar la ruta",
        variant: "destructive",
      });
    }
  };

  return (
      <Layout showLogin={false}>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <BackButton to="/dashboard" label="Volver al Dashboard" />
              <h1 className="text-3xl font-bold text-foreground">
                Gestión de Rutas
              </h1>
            </div>
            <p className="text-muted-foreground">
              Administra y gestiona las rutas disponibles en el sistema.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                  placeholder="Buscar ruta..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input"
                  aria-label="Buscar rutas por código o nombre"
              />
            </div>

            <div className="flex gap-2">
              <Button
                  className="bg-primary hover:bg-primary-hover"
                  onClick={loadRoutes}
                  aria-label="Buscar rutas"
              >
                Buscar
              </Button>
              <Button
                  className="bg-primary hover:bg-primary-hover"
                  onClick={() => setCreateModalOpen(true)}
                  aria-label="Registrar nueva ruta"
              >
                <Plus className="h-4 w-4 mr-2" />
                Registrar Ruta
              </Button>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="font-semibold text-foreground">CÓDIGO</TableHead>
                  <TableHead className="font-semibold text-foreground">NOMBRE</TableHead>
                  <TableHead className="font-semibold text-foreground">DESCRIPCIÓN</TableHead>
                  <TableHead className="font-semibold text-foreground text-right">ACCIONES</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        Cargando rutas...
                      </TableCell>
                    </TableRow>
                ) : filteredRoutes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        {searchTerm ? "No se encontraron rutas que coincidan con tu búsqueda." : "No hay rutas registradas."}
                      </TableCell>
                    </TableRow>
                ) : (
                    filteredRoutes.map((route) => (
                        <TableRow key={route.id} className="hover:bg-muted/20">
                          <TableCell className="font-medium text-foreground">{route.codigo || `R${route.id}`}</TableCell>
                          <TableCell className="text-foreground">{route.nombre}</TableCell>
                          <TableCell className="text-foreground">{route.description || `${route.origen} - ${route.destino}`}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-border text-foreground hover:bg-muted"
                                  onClick={() => handleEdit(route)}
                                  aria-label={`Editar ruta ${route.nombre}`}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Editar
                              </Button>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                      aria-label={`Eliminar ruta ${route.nombre}`}
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
                                        Eliminar Ruta
                                      </AlertDialogTitle>
                                    </div>
                                    <AlertDialogDescription className="text-muted-foreground">
                                      ¿Desea eliminar la ruta {route.codigo} - {route.nombre}?
                                      <br />
                                      <span className="text-destructive font-medium">
                                  Esta acción no se puede deshacer.
                                </span>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-muted text-muted-foreground hover:bg-muted/80">
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => handleDelete(route.id, route.nombre)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && filteredRoutes.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Mostrando {filteredRoutes.length} de {routes.length} rutas
              </div>
          )}
        </div>

        <CreateRouteModal
            open={createModalOpen}
            onOpenChange={setCreateModalOpen}
            onRouteCreated={loadRoutes}
        />

        <EditRouteModal
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            route={selectedRoute}
            onRouteUpdated={loadRoutes}
        />
      </Layout>
  );
}