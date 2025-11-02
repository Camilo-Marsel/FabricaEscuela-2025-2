import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { conductoresAPI } from "@/services/api";

interface Driver {
  id: number;
  cedula: string;
  nombreCompleto?: string;
  username?: string;
  email: string;
  telefono?: string;
  licencia?: string;
}

interface EditDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver?: Driver;
  onDriverUpdated?: () => void;
}

export const EditDriverModal = ({ open, onOpenChange, driver, onDriverUpdated }: EditDriverModalProps) => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombreCompleto: "",
    email: "",
    telefono: "",
    licencia: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (driver) {
      setFormData({
        cedula: driver.cedula,
        nombreCompleto: driver.nombreCompleto || driver.username || "",
        email: driver.email,
        telefono: driver.telefono || "",
        licencia: driver.licencia || "",
      });
    }
  }, [driver]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!driver) return;

    if (!formData.cedula || !formData.nombreCompleto || !formData.email) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete al menos: cédula, nombre y email.",
        variant: "destructive",
      });
      return;
    }

    // Validar que cédula sea solo números
    if (!/^\d+$/.test(formData.cedula)) {
      toast({
        title: "Cédula inválida",
        description: "La cédula debe contener solo números.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Llamada REAL al backend
      await conductoresAPI.update(driver.id, {
        cedula: formData.cedula,
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        correo: formData.email,
        telefono: formData.telefono || "N/A",
        licencia: formData.licencia || "N/A",
      });

      toast({
        title: "Conductor actualizado",
        description: `Los datos de ${formData.nombreCompleto} han sido actualizados.`,
      });

      onOpenChange(false);
      onDriverUpdated?.(); // Recargar lista

    } catch (error: any) {
      console.error('Error actualizando conductor:', error);
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo actualizar el conductor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (driver) {
      setFormData({
        cedula: driver.cedula,
        nombreCompleto: driver.nombreCompleto || driver.username || "",
        email: driver.email,
        telefono: driver.telefono || "",
        licencia: driver.licencia || "",
      });
    }
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md" aria-describedby="edit-driver-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Editar conductor
            </DialogTitle>
          </DialogHeader>

          <div id="edit-driver-description" className="sr-only">
            Formulario para editar la información del conductor
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="edit-cedula" className="text-foreground font-medium">
                Cédula <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-cedula"
                  type="text"
                  inputMode="numeric"
                  value={formData.cedula}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    setFormData({ ...formData, cedula: value });
                  }}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-nombreCompleto" className="text-foreground font-medium">
                Nombre Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-nombreCompleto"
                  type="text"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="text-foreground font-medium">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-telefono" className="text-foreground font-medium">
                Teléfono
              </Label>
              <Input
                  id="edit-telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-licencia" className="text-foreground font-medium">
                Licencia de conducir
              </Label>
              <Input
                  id="edit-licencia"
                  type="text"
                  value={formData.licencia}
                  onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
                  className="bg-input border-border"
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
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
  );
};