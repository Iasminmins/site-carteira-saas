
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeRole, setActiveRole] = useState<"admin" | "employee">("admin");
  const { login, isLoading } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password, activeRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-industrial-blue to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581093458791-9d3cca96f2d6?q=80&w=1740&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
      </div>
      
      <div className="w-full max-w-md z-10 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white mb-4">
            <div className="h-8 w-8 rounded-full bg-industrial-blue flex items-center justify-center">
              <div className="h-5 w-5 rounded-full bg-industrial-yellow"></div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-poppins">Carteira Digital</h1>
          <p className="text-white/70 mt-1">Treinamento Industrial</p>
        </div>
        
        <Card className="border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-poppins">Login</CardTitle>
            <CardDescription>Acesse sua conta para gerenciar certificados</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="admin" className="w-full" onValueChange={(value) => setActiveRole(value as "admin" | "employee")}>
            <TabsList className="grid grid-cols-2 mx-6">
              <TabsTrigger value="admin">Administrador</TabsTrigger>
              <TabsTrigger value="employee">Colaborador</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admin">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="admin-password">Senha</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-industrial-blue hover:bg-industrial-blue/90" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    Entrar como Administrador
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="employee">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input
                      id="employee-email"
                      type="email"
                      placeholder="colaborador@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="employee-password">Senha</Label>
                    <Input
                      id="employee-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-industrial-blue hover:bg-industrial-blue/90" disabled={isLoading}>
                    {isLoading ? <Spinner className="mr-2" /> : null}
                    Entrar como Colaborador
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <p className="mt-8 text-white/50 text-sm text-center">
        © {new Date().getFullYear()} Carteira Digital. Todos os direitos reservados.
      </p>
    </div>
  );
};

export default Login;
