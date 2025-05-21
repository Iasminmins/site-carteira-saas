
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
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { user } = useAuth();
  
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
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${isOpen ? 'block' : 'hidden'}`} 
        onClick={toggleSidebar}
      />
      <aside 
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed top-0 left-0 z-30 w-64 h-screen bg-industrial-blue text-white transition-transform duration-300 ease-in-out flex flex-col overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-industrial-yellow"></div>
            </div>
            <h2 className="ml-2 font-poppins font-semibold">Carteira Digital</h2>
          </div>
          <Button 
            variant="ghost" 
            className="lg:hidden text-white hover:bg-white/10" 
            size="icon"
            onClick={toggleSidebar}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center py-2 px-4 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-white/10 text-industrial-yellow' 
                        : 'hover:bg-white/5'
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 mt-auto border-t border-white/10">
          <div className="bg-white/10 rounded-lg p-3 text-sm">
            <p className="font-medium">Carteira Digital</p>
            <p className="text-xs opacity-70">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
