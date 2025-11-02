import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import defaultAvatar from "@/assets/default-avatar.png";

interface UserMenuProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userRole?: string;
}

export const UserMenu = ({ 
  userName = "Juan Conductor", 
  userEmail = "juan.conductor@email.com",
  userAvatar,
  userRole = "Conductor"
}: UserMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
    navigate("/login");
  };

  const handleEditProfile = () => {
    toast({
      title: "Editar perfil",
      description: "Funcionalidad próximamente disponible.",
    });
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="flex items-center gap-3">
      {/* Greeting Text */}
      <span className="text-foreground font-medium hidden sm:block">
        Hola, {userName.split(' ')[0]}
      </span>

      {/* User Menu Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-10 w-10 rounded-full hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label={`Menú de usuario - ${userName}`}
          >
            <Avatar className="h-10 w-10 border-2 border-border">
              <AvatarImage 
                src={userAvatar || defaultAvatar} 
                alt={`Avatar de ${userName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-64 bg-card border-border shadow-lg" 
          align="end" 
          forceMount
        >
          {/* User Info */}
          <div className="flex items-center gap-3 p-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={userAvatar || defaultAvatar} 
                alt={`Avatar de ${userName}`}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getUserInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground">{userRole}</p>
            </div>
          </div>
          
          <DropdownMenuSeparator className="bg-border" />
          
          {/* Menu Items */}
          <DropdownMenuItem 
            onClick={handleEditProfile}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted focus:bg-muted"
          >
            <Settings className="h-4 w-4" />
            <span>Editar perfil</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-border" />
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted focus:bg-muted text-destructive focus:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};