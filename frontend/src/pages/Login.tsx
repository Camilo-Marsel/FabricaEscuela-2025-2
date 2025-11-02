import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Truck, User, Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api, { saveAuth } from "@/services/api";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ username: false, password: false });

    // Validación: campos vacíos
    if (!formData.username || !formData.password) {
      setError("Se debe ingresar usuario y contraseña.");
      setFieldErrors({
        username: !formData.username,
        password: !formData.password
      });
      return;
    }

    // Validación: cédula solo números
    if (!/^\d+$/.test(formData.username)) {
      setError("La cédula debe contener solo números.");
      setFieldErrors({ username: true, password: false });
      return;
    }

    setIsLoading(true);

    try {
      // ✅ Llamada REAL al backend
      const response = await api.post<{
        token: string;
        correo: string;
        rol: string;
        mensaje: string;
      }>('/auth/login-cedula', {
        cedula: formData.username,
        password: formData.password
      });

      // Guardar autenticación
      saveAuth(response.token, response.correo, response.rol);

      toast({
        title: "Sesión iniciada exitosamente",
        description: "Bienvenido a Momentum Fleet",
      });

      // Redirigir según el rol
      if (response.rol === 'ADMIN') {
        navigate("/dashboard");
      } else if (response.rol === 'CONDUCTOR') {
        navigate("/driver-dashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error('Error de login:', error);
      setError(error.message || "Usuario o contraseña son incorrectos.");
      setFieldErrors({ username: true, password: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Layout showLogin={false}>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
          <Card className="w-full max-w-md shadow-lg border-border bg-card">
            <CardContent className="p-8">
              {/* Logo and Title */}
              <div className="flex flex-col items-center mb-8">
                <div className="bg-primary p-4 rounded-xl mb-4">
                  <Truck className="h-12 w-12 text-primary-foreground" aria-hidden="true" />
                </div>
                <h1 className="text-2xl font-bold text-center text-card-foreground">
                  Momentum Fleet
                </h1>
                <p className="text-muted-foreground text-center mt-1">
                  Acceso al sistema de gestión
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-card-foreground font-medium">
                    Cédula
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="username"
                        type="text"
                        inputMode="numeric"
                        placeholder="Ej. 1234567890"
                        value={formData.username}
                        onChange={(e) => {
                          // Solo permitir números
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, username: value });
                          setFieldErrors({ ...fieldErrors, username: false });
                          setError("");
                        }}
                        className={`pl-10 bg-input ${fieldErrors.username ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                        aria-describedby={error ? "login-error" : undefined}
                        aria-invalid={fieldErrors.username ? "true" : "false"}
                        autoComplete="username"
                        required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          setFieldErrors({ ...fieldErrors, password: false });
                          setError("");
                        }}
                        className={`pl-10 pr-10 bg-input ${fieldErrors.password ? 'border-destructive focus-visible:ring-destructive' : 'border-border'}`}
                        aria-describedby={error ? "login-error" : undefined}
                        aria-invalid={fieldErrors.password ? "true" : "false"}
                        autoComplete="current-password"
                        required
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                    disabled={isLoading}
                    aria-describedby={error ? "login-error" : undefined}
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>

                {error && (
                    <div
                        id="login-error"
                        className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/30 rounded-md p-3"
                        role="alert"
                        aria-live="polite"
                    >
                      {error}
                    </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
}