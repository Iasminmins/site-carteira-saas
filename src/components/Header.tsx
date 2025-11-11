
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
    <header className="w-full flex justify-between items-center py-4 px-4 sm:px-6 bg-white shadow-sm animate-fade-in sticky top-0 z-10">
      <div className="flex items-center min-w-0">
        {showMenuToggle && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="mr-2 lg:hidden text-industrial-blue flex-shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center min-w-0">
          <div className="h-8 w-8 rounded-full bg-industrial-blue flex items-center justify-center flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-industrial-yellow"></div>
          </div>
          <h1 className="ml-2 font-poppins font-semibold text-base sm:text-lg hidden sm:block truncate">
            Carteira Digital
          </h1>
        </div>
      </div>
      
      {user && (
        <div className="relative">
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <div className="mr-4 text-right hidden sm:block">
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user.role === "admin" ? "Administrador" : "Colaborador"}</p>
            </div>
            <Avatar className="border-2 border-industrial-blue">
              <AvatarImage src={user.photo} />
              <AvatarFallback className="bg-industrial-blue text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border animate-fade-in">
              <div className="px-4 py-2 block sm:hidden">
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role === "admin" ? "Administrador" : "Colaborador"}</p>
              </div>
              <hr className="my-1 block sm:hidden" />
              <button 
                className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
