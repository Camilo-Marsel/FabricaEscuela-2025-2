import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { conductoresAPI } from "@/services/api";

interface CreateDriverModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDriverCreated?: () => void;
}

export const CreateDriverModal = ({ open, onOpenChange, onDriverCreated }: CreateDriverModalProps) => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombreCompleto: "",
    email: "",
    telefono: "",
    licencia: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => { // ✅ AGREGADO async
    e.preventDefault();

    // Validación básica
    if (!formData.cedula || !formData.nombreCompleto || !formData.email || !formData.password) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete al menos: cédula, nombre, email y contraseña.",
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

    // ✅ Validar contraseña mínima
    if (formData.password.length < 6) {
      toast({
        title: "Contraseña muy corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Llamada REAL al backend con password
      await conductoresAPI.create({
        cedula: formData.cedula,
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        telefono: formData.telefono || "N/A",
        licencia: formData.licencia || "N/A",
        correo: formData.email,
        password: formData.password, // ✅ AGREGADO
      });

      toast({
        title: "Conductor registrado",
        description: `El conductor ${formData.nombreCompleto} ha sido registrado exitosamente.`,
      });

      // Limpiar formulario
      setFormData({
        cedula: "",
        nombreCompleto: "",
        email: "",
        telefono: "",
        licencia: "",
        password: ""
      });

      onOpenChange(false);
      onDriverCreated?.(); // Recargar lista

    } catch (error: any) {
      console.error('Error creando conductor:', error);
      toast({
        title: "Error al registrar",
        description: error.message || "No se pudo registrar el conductor",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      cedula: "",
      nombreCompleto: "",
      email: "",
      telefono: "",
      licencia: "",
      password: ""
    });
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-card border-border max-w-md" aria-describedby="create-driver-description">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-foreground">
              Registrar conductor
            </DialogTitle>
          </DialogHeader>

          <div id="create-driver-description" className="sr-only">
            Formulario para registrar un nuevo conductor en el sistema
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="cedula" className="text-foreground font-medium">
                Cédula <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="cedula"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej. 1234567890"
                  value={formData.cedula}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Solo números
                    setFormData({ ...formData, cedula: value });
                  }}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nombreCompleto" className="text-foreground font-medium">
                Nombre Completo <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="nombreCompleto"
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Correo electrónico <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="email"
                  type="email"
                  placeholder="usuario@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-input border-border"
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-foreground font-medium">
                Teléfono
              </Label>
              <Input
                  id="telefono"
                  type="tel"
                  placeholder="Ej. 3001234567"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licencia" className="text-foreground font-medium">
                Licencia de conducir
              </Label>
              <Input
                  id="licencia"
                  type="text"
                  placeholder="Ej. C2-12345678"
                  value={formData.licencia}
                  onChange={(e) => setFormData({ ...formData, licencia: e.target.value })}
                  className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Contraseña <span className="text-destructive">*</span>
              </Label>
              <Input
                  id="password"
                  type="password"
                  placeholder="Contraseña del conductor"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-input border-border"
                  required
              />
              <p className="text-xs text-muted-foreground">
                Esta será la contraseña que el conductor usará para iniciar sesión
              </p>
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