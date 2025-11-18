// frontend/src/components/modals/EditRouteModal.tsx
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { rutasAPI } from "@/services/api";

interface Route {
  id: number;
  nombre: string;
  origen: string;
  destino: string;
  duracionEnMinutos: number;
  codigo?: string;
  description?: string;
}

interface EditRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: Route;
  onRouteUpdated?: () => void;
}

export const EditRouteModal = ({ open, onOpenChange, route, onRouteUpdated }: EditRouteModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    origen: "",
    destino: "",
    duracionEnMinutos: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Cargar datos de la ruta cuando se abre el modal
  useEffect(() => {
    if (route) {
      setFormData({
        nombre: route.nombre,
        origen: route.origen,
        destino: route.destino,
        duracionEnMinutos: route.duracionEnMinutos.toString()
      });
    }
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.origen || !formData.destino || !formData.duracionEnMinutos) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    if (!route) {
      toast({
        title: "Error",
        description: "No se pudo identificar la ruta a editar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await rutasAPI.update(route.id, {
        nombre: formData.nombre,
        origen: formData.origen,
        destino: formData.destino,
        duracionEnMinutos: parseInt(formData.duracionEnMinutos)
      });

      toast({
        title: "Ruta actualizada",
        description: `La ruta ${formData.nombre} ha sido actualizada exitosamente.`,
      });

      onOpenChange(false);
      onRouteUpdated?.();

    } catch (error: any) {
      toast({
        title: "Error al actualizar ruta",
        description: error.message || "No se pudo actualizar la ruta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar valores originales
    if (route) {
      setFormData({
        nombre: route.nombre,
        origen: route.origen,
        destino: route.destino,
        duracionEnMinutos: route.duracionEnMinutos.toString()
      });
    }
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md" aria-describedby="edit-route-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Editar ruta
            </DialogTitle>
          </DialogHeader>

          <div id="edit-route-description" className="sr-only">
            Formulario para editar información de la ruta
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="edit-route-nombre" className="text-foreground font-medium">
                Nombre de la ruta <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-route-nombre"
                  type="text"
                  placeholder="Ej: Ruta Norte"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            {/* Origen */}
            <div className="space-y-2">
              <Label htmlFor="edit-route-origen" className="text-foreground font-medium">
                Origen <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-route-origen"
                  type="text"
                  placeholder="Ej: Terminal Norte"
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            {/* Destino */}
            <div className="space-y-2">
              <Label htmlFor="edit-route-destino" className="text-foreground font-medium">
                Destino <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-route-destino"
                  type="text"
                  placeholder="Ej: Centro"
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="edit-route-duracion" className="text-foreground font-medium">
                Duración (minutos) <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-route-duracion"
                  type="number"
                  min="1"
                  placeholder="Ej: 45"
                  value={formData.duracionEnMinutos}
                  onChange={(e) => setFormData({ ...formData, duracionEnMinutos: e.target.value })}
                  className="bg-input border-border"
                  required
              />
              {formData.duracionEnMinutos && parseInt(formData.duracionEnMinutos) > 0 && (
                  <p className="text-xs text-muted-foreground">
                    ≈ {Math.floor(parseInt(formData.duracionEnMinutos) / 60)}h {parseInt(formData.duracionEnMinutos) % 60}m
                  </p>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="flex-1 border-border text-foreground hover:bg-muted"
                  disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
              >
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};