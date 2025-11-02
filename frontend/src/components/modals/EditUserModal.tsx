import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  nombre: string;
  email: string;
  usuario: string;
  rol: string;
}

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onUserUpdated?: () => void;
}

export const EditUserModal = ({ open, onOpenChange, user, onUserUpdated }: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    usuario: "",
    rol: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        usuario: user.usuario,
        rol: user.rol,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.usuario || !formData.rol) {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Usuario actualizado",
        description: `Los datos del usuario ${formData.usuario} han sido actualizados.`,
      });
      onOpenChange(false);
      onUserUpdated?.();
    }, 1000);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        email: user.email,
        usuario: user.usuario,
        rol: user.rol,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md" aria-describedby="edit-user-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Editar usuario
          </DialogTitle>
        </DialogHeader>
        
        <div id="edit-user-description" className="sr-only">
          Formulario para editar información del usuario
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-user-nombre" className="text-foreground font-medium">
              Nombre completo
            </Label>
            <Input
              id="edit-user-nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-email" className="text-foreground font-medium">
              Correo electrónico
            </Label>
            <Input
              id="edit-user-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-usuario" className="text-foreground font-medium">
              Usuario
            </Label>
            <Input
              id="edit-user-usuario"
              type="text"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-user-rol" className="text-foreground font-medium">
              Rol
            </Label>
            <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="administrador">Administrador</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="operador">Operador</SelectItem>
              </SelectContent>
            </Select>
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