
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  toggleSidebar?: () => void;
  showMenuToggle?: boolean;
}

export function Header({ toggleSidebar, showMenuToggle = true }: HeaderProps) {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="w-full flex justify-between items-center py-3.5 px-6 lg:px-8 bg-white border-b border-gray-200 animate-fade-in sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {showMenuToggle && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="lg:hidden text-industrial-blue flex-shrink-0 hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-industrial-blue to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
            <div className="h-6 w-6 rounded-full bg-industrial-yellow"></div>
          </div>
          <div className="hidden lg:block">
            <h1 className="font-poppins font-bold text-lg text-gray-900 leading-tight">
              Carteira Digital
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">Sistema de Certificados</p>
          </div>
        </div>
      </div>
      
      {user && (
        <div className="relative flex-shrink-0">
          <div 
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-1.5 transition-all duration-200 ease-in-out"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="text-right hidden lg:block">
              <p className="font-semibold text-sm text-gray-900 leading-tight">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">
                {user.role === "admin" ? "Administrador" : "Colaborador"}
              </p>
            </div>
            <Avatar className="h-9 w-9 border-2 border-industrial-blue shadow-md hover:shadow-lg transition-shadow duration-200">
              <AvatarImage src={user.photo} />
              <AvatarFallback className="bg-industrial-blue text-white font-semibold text-sm">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 lg:w-64 bg-white rounded-xl shadow-2xl py-2 z-20 border border-gray-200 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-100 lg:hidden">
                <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize mt-1">
                  {user.role === "admin" ? "Administrador" : "Colaborador"}
                </p>
              </div>
              <button 
                className="flex w-full items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Sair da Conta</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
