
import { createContext, useState, useContext, ReactNode } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  photo?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: "admin" | "employee") => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string, role: "admin" | "employee") => {
    setIsLoading(true);
    try {
      // Simulate API request
      setTimeout(() => {
        // Mock users for demo purposes
        if (email && password) {
          if (role === "admin") {
            setUser({
              id: "1",
              name: "Amanda Silva",
              email: email,
              role: "admin",
              photo: "https://i.pravatar.cc/150?img=32"
            });
            toast.success("Login realizado com sucesso!");
            navigate('/admin/dashboard');
          } else {
            setUser({
              id: "2",
              name: "Carlos Oliveira",
              email: email,
              role: "employee",
              photo: "https://i.pravatar.cc/150?img=12"
            });
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
