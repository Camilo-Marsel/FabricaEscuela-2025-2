import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { rutasAPI } from "@/services/api";

interface CreateRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteCreated?: () => void;
}

export const CreateRouteModal = ({ open, onOpenChange, onRouteCreated }: CreateRouteModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    origen: "",
    destino: "",
    duracionEnMinutos: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

    setIsLoading(true);

    try {
      await rutasAPI.create({
        nombre: formData.nombre,
        origen: formData.origen,
        destino: formData.destino,
        duracionEnMinutos: parseInt(formData.duracionEnMinutos)
      });

      toast({
        title: "Ruta creada",
        description: `La ruta ${formData.nombre} ha sido creada exitosamente.`,
      });

      setFormData({ nombre: "", origen: "", destino: "", duracionEnMinutos: "" });
      onOpenChange(false);
      onRouteCreated?.();

    } catch (error: any) {
      toast({
        title: "Error al crear ruta",
        description: error.message || "No se pudo crear la ruta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: "", origen: "", destino: "", duracionEnMinutos: "" });
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md" aria-describedby="create-route-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Crear nueva ruta
            </DialogTitle>
          </DialogHeader>

          <div id="create-route-description" className="sr-only">
            Formulario para crear una nueva ruta de transporte
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="route-nombre" className="text-foreground font-medium">
                Nombre de la ruta <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="route-nombre"
                  type="text"
                  placeholder="Ej: Ruta Norte"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-origen" className="text-foreground font-medium">
                Origen <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="route-origen"
                  type="text"
                  placeholder="Ej: Terminal Norte"
                  value={formData.origen}
                  onChange={(e) => setFormData({ ...formData, origen: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-destino" className="text-foreground font-medium">
                Destino <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="route-destino"
                  type="text"
                  placeholder="Ej: Centro"
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="route-duracion" className="text-foreground font-medium">
                Duración (minutos) <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="route-duracion"
                  type="number"
                  min="1"
                  placeholder="Ej: 45"
                  value={formData.duracionEnMinutos}
                  onChange={(e) => setFormData({ ...formData, duracionEnMinutos: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

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
                {isLoading ? "Creando..." : "Crear Ruta"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};