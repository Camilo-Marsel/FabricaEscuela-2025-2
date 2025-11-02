import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated?: () => void;
}

export const CreateUserModal = ({ open, onOpenChange, onUserCreated }: CreateUserModalProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    usuario: "",
    password: "",
    rol: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.email || !formData.usuario || !formData.password || !formData.rol) {
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
        title: "Usuario creado",
        description: `El usuario ${formData.usuario} ha sido creado exitosamente.`,
      });
      setFormData({ nombre: "", email: "", usuario: "", password: "", rol: "" });
      onOpenChange(false);
      onUserCreated?.();
    }, 1000);
  };

  const handleCancel = () => {
    setFormData({ nombre: "", email: "", usuario: "", password: "", rol: "" });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md" aria-describedby="create-user-description">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            Crear nuevo usuario
          </DialogTitle>
        </DialogHeader>
        
        <div id="create-user-description" className="sr-only">
          Formulario para crear un nuevo usuario del sistema
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user-nombre" className="text-foreground font-medium">
              Nombre completo
            </Label>
            <Input
              id="user-nombre"
              type="text"
              placeholder="Ingrese el nombre completo"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-email" className="text-foreground font-medium">
              Correo electrónico
            </Label>
            <Input
              id="user-email"
              type="email"
              placeholder="usuario@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-usuario" className="text-foreground font-medium">
              Usuario
            </Label>
            <Input
              id="user-usuario"
              type="text"
              placeholder="Nombre de usuario"
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password" className="text-foreground font-medium">
              Contraseña
            </Label>
            <Input
              id="user-password"
              type="password"
              placeholder="Ingrese la contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="bg-input border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-rol" className="text-foreground font-medium">
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
              {isLoading ? "Creando..." : "Crear Usuario"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};