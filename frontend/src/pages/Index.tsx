import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Route, Users, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6" aria-labelledby="hero-title">
          <div className="space-y-4">
            <h1 id="hero-title" className="text-4xl md:text-6xl font-bold text-foreground">
              Momentum Fleet
            </h1>
            <h2 className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Sistema profesional de gestión de transporte accesible e inclusivo
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Plataforma desarrollada siguiendo los principios del Proyecto A11Y para crear 
              experiencias digitales que todos puedan usar de manera eficiente.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              asChild 
              className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg"
            >
              <Link to="/driver-notifications">Acceder al Sistema</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="px-8 py-6 text-lg border-border"
            >
              <Link to="/dashboard">Ver Demo</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section aria-labelledby="features-title">
          <h2 id="features-title" className="text-3xl font-bold text-center text-foreground mb-12">
            Características Principales
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Route className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Gestión de Rutas</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Administra rutas de transporte con herramientas intuitivas y accesibles 
                  para optimizar operaciones diarias.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Control de Conductores</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Gestiona información de conductores, licencias y asignaciones 
                  con interfaces diseñadas para todos los usuarios.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Accesibilidad A11Y</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cumple con estándares WCAG para garantizar que todas las personas 
                  puedan usar el sistema sin barreras.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Truck className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Operaciones en Tiempo Real</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitorea el estado de la flota y operaciones con actualizaciones 
                  en tiempo real y notificaciones accesibles.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Interfaz Intuitiva</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Diseño limpio y funcional que prioriza la usabilidad y 
                  la experiencia de usuario para todos los niveles de habilidad.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Inclusión Digital</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Desarrollado con enfoque en diversidad e inclusión para crear 
                  un entorno digital verdaderamente equitativo.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-muted rounded-lg p-12 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Comienza a Gestionar tu Flota Hoy
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Únete a organizaciones que han modernizado sus operaciones de transporte 
            con herramientas accesibles y eficientes.
          </p>
          <Button 
            size="lg" 
            asChild 
            className="bg-primary hover:bg-primary-hover text-primary-foreground px-8 py-6 text-lg"
          >
            <Link to="/driver-notifications">Comenzar Ahora</Link>
          </Button>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
