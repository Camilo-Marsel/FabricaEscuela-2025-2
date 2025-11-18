// frontend/src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { Truck, User, Lock, Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api, { saveAuth } from "@/services/api";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false
  });
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [correoTemporal, setCorreoTemporal] = useState('');

  const esCorreo = (texto: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto);
  };

  const esCedula = (texto: string): boolean => {
    return /^\d{6,10}$/.test(texto);
  };

  const getTipoIdentificador = (): 'correo' | 'cedula' | 'unknown' => {
    const { username } = formData;

    if (esCorreo(username)) {
      return 'correo';
    }
    if (esCedula(username)) {
      return 'cedula';
    }
    return 'unknown';
  };

  const tipo = getTipoIdentificador();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setError("");
    setFieldErrors({ username: false, password: false });

    // Validaciones
    if (!formData.username || !formData.password) {
      const errorMsg = "Se debe ingresar usuario y contraseña.";
      setError(errorMsg);
      setFieldErrors({
        username: !formData.username,
        password: !formData.password
      });

      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: errorMsg,
        duration: 5000, // ✅ 5 segundos
      });
      return;
    }

    if (tipo === 'unknown') {
      const errorMsg = "Ingresa un correo válido o una cédula de 6-10 dígitos.";
      setError(errorMsg);
      setFieldErrors({ username: true, password: false });

      toast({
        variant: "destructive",
        title: "Formato inválido",
        description: errorMsg,
        duration: 5000,
      });
      return;
    }

    if (formData.password.length < 6) {
      const errorMsg = "La contraseña debe tener al menos 6 caracteres.";
      setError(errorMsg);
      setFieldErrors({ username: false, password: true });

      toast({
        variant: "destructive",
        title: "Contraseña inválida",
        description: errorMsg,
        duration: 5000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // CASO 1: Login con correo (envía código)
      if (tipo === 'correo') {
        console.log('📧 Login con correo:', formData.username);

        const response = await api.post<{ mensaje: string }>('/api/auth/login', {
          correo: formData.username,
          password: formData.password
        });

        console.log('✅ Respuesta del servidor:', response);
        setCorreoTemporal(formData.username);
        setStep('verify');

        toast({
          title: "Código enviado",
          description: "Revisa tu correo para obtener el código de verificación.",
          duration: 5000,
        });
      }
      // CASO 2: Login con cédula (directo)
      else {
        console.log('🆔 Login con cédula:', formData.username);

        const response = await api.post<{
          token: string;
          correo: string;
          rol: string;
          mensaje: string;
        }>('/api/auth/login-cedula', {
          cedula: formData.username,
          password: formData.password
        });

        console.log('✅ Respuesta del servidor:', response);

        // Guardar autenticación
        saveAuth(response.token, response.correo, response.rol);

        toast({
          title: "✅ Sesión iniciada",
          description: `Bienvenido, ${response.rol === 'ADMIN' ? 'Administrador' : 'Conductor'}`,
          duration: 3000, // ✅ 3 segundos
        });

        // ✅ Redirigir después de 1.5 segundos
        setTimeout(() => {
          if (response.rol === 'ADMIN') {
            navigate("/dashboard");
          } else if (response.rol === 'CONDUCTOR') {
            navigate("/driver-dashboard");
          } else {
            navigate("/dashboard");
          }
        }, 1500); // ✅ Aumentado a 1.5 segundos
      }
    } catch (err: any) {
      console.error('❌ Error de login:', err);

      const errorMsg = err.message || "Usuario o contraseña incorrectos.";
      setError(errorMsg);
      setFieldErrors({ username: true, password: true });

      toast({
        variant: "destructive",
        title: "Error de autenticación",
        description: errorMsg,
        duration: 5000, // ✅ 5 segundos para errores
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!codigo.trim()) {
      const errorMsg = "Por favor ingresa el código de verificación.";
      setError(errorMsg);

      toast({
        variant: "destructive",
        title: "Código requerido",
        description: errorMsg,
        duration: 4000,
      });
      return;
    }

    if (codigo.length !== 6) {
      const errorMsg = "El código debe tener 6 dígitos.";
      setError(errorMsg);

      toast({
        variant: "destructive",
        title: "Código inválido",
        description: errorMsg,
        duration: 4000,
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔐 Verificando código para:', correoTemporal);

      const response = await api.post<{
        token: string;
        correo: string;
        rol: string;
        mensaje: string;
      }>('/api/auth/verify', {
        correo: correoTemporal,
        codigo
      });

      // Guardar autenticación
      saveAuth(response.token, response.correo, response.rol);

      toast({
        title: "✅ Autenticación exitosa",
        description: `Bienvenido, ${response.rol === 'ADMIN' ? 'Administrador' : 'Conductor'}`,
        duration: 3000,
      });

      // ✅ Redirigir después de 1.5 segundos
      setTimeout(() => {
        if (response.rol === 'ADMIN') {
          navigate("/dashboard");
        } else if (response.rol === 'CONDUCTOR') {
          navigate("/driver-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);

    } catch (err: any) {
      console.error('❌ Error al verificar código:', err);

      const errorMsg = err.message || "Código inválido o expirado.";
      setError(errorMsg);

      toast({
        variant: "destructive",
        title: "Error de verificación",
        description: errorMsg,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolver = () => {
    setStep('login');
    setCodigo('');
    setError("");
  };

  return (
      <Layout showLogin={false}>
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center"
             onClick={(e) => e.stopPropagation()}>
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
                  {step === 'login'
                      ? 'Acceso al sistema de gestión'
                      : 'Verificación de código'}
                </p>
              </div>

              {/* PASO 1: LOGIN FORM */}
              {step === 'login' && (
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-card-foreground font-medium">
                        Correo o Cédula
                      </Label>
                      <div className="relative">
                        {tipo === 'correo' ? (
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        ) : (
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                        )}
                        <Input
                            id="username"
                            type="text"
                            placeholder="ejemplo@correo.com o 1234567890"
                            value={formData.username}
                            onChange={(e) => {
                              setFormData({ ...formData, username: e.target.value });
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
                      {tipo !== 'unknown' && formData.username && (
                          <p className="text-xs text-muted-foreground">
                            {tipo === 'correo'
                                ? '📧 Se enviará un código a tu correo'
                                : '🆔 Acceso directo con cédula'}
                          </p>
                      )}
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

                    {/* ✅ Mostrar error persistente en el formulario */}
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

                    <div className="text-center text-xs text-muted-foreground mt-4">
                      <p>💡 Puedes usar tu correo o cédula para iniciar sesión</p>

                      {/* MODO DESARROLLO: Mostrar credenciales de prueba */}
                      {import.meta.env.DEV && (
                          <details className="mt-4 text-left border rounded p-3">
                            <summary className="cursor-pointer font-semibold text-blue-600">
                              🔧 Credenciales de prueba (desarrollo)
                            </summary>
                            <div className="mt-2 space-y-2 text-xs">
                              <div className="border-l-2 border-blue-500 pl-2">
                                <p className="font-semibold">Admin:</p>
                                <p>Cédula: <code className="bg-gray-100 px-1 rounded">123456</code></p>
                                <p>Password: <code className="bg-gray-100 px-1 rounded">123456</code></p>
                              </div>
                              <div className="border-l-2 border-green-500 pl-2">
                                <p className="font-semibold">Conductor:</p>
                                <p>Cédula: <code className="bg-gray-100 px-1 rounded">1144199553</code></p>
                                <p>Password: <code className="bg-gray-100 px-1 rounded">password</code></p>
                              </div>
                            </div>
                          </details>
                      )}
                    </div>
                  </form>
              )}

              {/* PASO 2: VERIFICACIÓN DE CÓDIGO */}
              {step === 'verify' && (
                  <form onSubmit={handleVerifyCode} className="space-y-6" noValidate>
                    <div className="space-y-2">
                      <Label htmlFor="codigo" className="text-card-foreground font-medium">
                        Código de Verificación
                      </Label>
                      <Input
                          id="codigo"
                          type="text"
                          inputMode="numeric"
                          placeholder="123456"
                          value={codigo}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setCodigo(value);
                            setError("");
                          }}
                          className="text-center text-2xl tracking-widest bg-input border-border"
                          maxLength={6}
                          autoFocus
                          required
                          aria-describedby={error ? "verify-error" : undefined}
                      />
                      <p className="text-xs text-muted-foreground text-center">
                        Ingresa el código de 6 dígitos enviado a {correoTemporal}
                      </p>
                    </div>

                    {error && (
                        <div
                            id="verify-error"
                            className="text-destructive text-sm text-center bg-destructive/10 border border-destructive/30 rounded-md p-3"
                            role="alert"
                            aria-live="polite"
                        >
                          {error}
                        </div>
                    )}

                    <div className="space-y-2">
                      <Button
                          type="submit"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
                          disabled={isLoading}
                      >
                        {isLoading ? "Verificando..." : "Verificar Código"}
                      </Button>

                      <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={handleVolver}
                          disabled={isLoading}
                      >
                        Volver al inicio
                      </Button>
                    </div>
                  </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Layout>
  );
}