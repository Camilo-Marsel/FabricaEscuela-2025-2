import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Route {
  id: string;
  name: string;
  description: string;
}

interface EditRouteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  route?: Route;
  onRouteUpdated?: () => void;
}

export const EditRouteModal = ({ open, onOpenChange, route, onRouteUpdated }: EditRouteModalProps) => {
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    descripcion: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (route) {
      setFormData({
        codigo: route.id,
        nombre: route.name,
        descripcion: route.description,
      });
    }
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete código y nombre de la ruta.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Ruta actualizada",
        description: `La ruta ${formData.codigo} - ${formData.nombre} ha sido actualizada.`,
      });
      onOpenChange(false);
      onRouteUpdated?.();
    }, 1000);
  };

  const handleCancel = () => {
    if (route) {
      setFormData({
        codigo: route.id,
        nombre: route.name,
        descripcion: route.description,
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
          <div className="space-y-2">
            <Label htmlFor="edit-route-codigo" className="text-foreground font-medium">
              Código de ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-route-codigo"
              type="text"
              value={formData.codigo}
              onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-route-nombre" className="text-foreground font-medium">
              Nombre de la ruta <span className="text-destructive">*</span>
            </Label>
            <Input
              id="edit-route-nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-route-descripcion" className="text-foreground font-medium">
              Descripción
            </Label>
            <Textarea
              id="edit-route-descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              className="bg-input border-border min-h-[80px] resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1 border-border text-foreground hover:bg-muted"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};