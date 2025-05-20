
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "superadmin" | "admin" | "employee";
  photo?: string;
  companyId?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: "superadmin" | "admin" | "employee") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Verifica se já existe um usuário salvo no localStorage ao iniciar
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string, role: "superadmin" | "admin" | "employee") => {
    setIsLoading(true);
    try {
      // Simulate API request
      setTimeout(() => {
        // Mock users for demo purposes
        if (email && password) {
          let userData: User;
          
          if (role === "superadmin") {
            userData = {
              id: "super1",
              name: "Roberto Mendes",
              email: email,
              role: "superadmin",
              photo: "https://i.pravatar.cc/150?img=40"
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success("Login realizado com sucesso!");
            navigate('/superadmin/dashboard');
          } else if (role === "admin") {
            userData = {
              id: "1",
              name: "Amanda Silva",
              email: email,
              role: "admin",
              photo: "https://i.pravatar.cc/150?img=32",
              companyId: "1"
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success("Login realizado com sucesso!");
            navigate('/admin/dashboard');
          } else {
            userData = {
              id: "2",
              name: "Carlos Oliveira",
              email: email,
              role: "employee",
              photo: "https://i.pravatar.cc/150?img=12",
              companyId: "1"
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            toast.success("Login realizado com sucesso!");
            navigate('/employee/certificates');
          }
        }
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Erro ao fazer login. Tente novamente.");
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.info("Sessão encerrada");
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
