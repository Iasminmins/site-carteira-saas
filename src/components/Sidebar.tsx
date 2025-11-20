
import { useAuth } from "@/contexts/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  ChevronLeft,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  
  if (!user || user.role !== "admin") return null;

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      title: "Certificados",
      path: "/admin/certificates",
      icon: <FileText size={20} />
    },
    {
      title: "Colaboradores",
      path: "/admin/employees",
      icon: <Users size={20} />
    },
    {
      title: "Configurações",
      path: "/admin/settings",
      icon: <Settings size={20} />
    }
  ];

  return (
    <>
      {/* Overlay - só aparece no mobile quando sidebar está aberto */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleSidebar}
      />
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out flex flex-col bg-gradient-to-b from-industrial-blue to-blue-900 text-white shadow-2xl
                    ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'}
                    lg:translate-x-0 lg:w-20 lg:hover:w-64`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10 min-h-[65px]">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300`}>
            <div className="h-10 w-10 min-w-[2.5rem] rounded-lg bg-white flex items-center justify-center shadow-lg">
              <div className="h-6 w-6 rounded-full bg-industrial-yellow"></div>
            </div>
            <div className={`overflow-hidden whitespace-nowrap transition-all duration-300`}>
              <h2 className="font-poppins font-bold text-base">Carteira Digital</h2>
              <p className="text-xs text-white/70 mt-0.5">v1.0.0</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="lg:hidden text-white hover:bg-white/10" 
            size="icon"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
        
        <nav className="flex-1 p-3 overflow-y-auto">
          <ul className="space-y-1.5">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center py-3 px-3.5 rounded-lg transition-all duration-200 ${
                      isActive 
                        ? 'bg-white/15 text-industrial-yellow shadow-md' 
                        : 'hover:bg-white/10'
                    }`
                  }
                >
                  <span className="min-w-[20px] mr-3 flex items-center justify-center">{item.icon}</span>
                  <span className="whitespace-nowrap overflow-hidden transition-opacity duration-300 ease-in-out font-medium text-sm">{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-3 mt-auto border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-3 text-sm backdrop-blur-sm">
            <p className="font-semibold whitespace-nowrap overflow-hidden text-sm">Carteira Digital</p>
            <p className="text-xs opacity-70 whitespace-nowrap overflow-hidden mt-1">Versão 1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
