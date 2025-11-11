
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Save,
  LogOut,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  // Form states
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState("usuario@empresa.com");
  const [notifications, setNotifications] = useState({
    newCertificates: true,
    expiringSoon: true,
    expired: true,
    system: false,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram atualizadas.",
    });
  };

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleMenu} showMenuToggle={true} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:ml-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="text-sm sm:text-base text-gray-600">Gerencie suas preferências</p>
            </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="mr-2 h-4 w-4" />
                Segurança
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Atualize suas informações de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24 border-2 border-industrial-blue">
                        <AvatarImage src={user?.photo} />
                        <AvatarFallback className="bg-industrial-blue text-white text-xl">
                          {user?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm" className="mt-2">
                        Alterar foto
                      </Button>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="id">ID / Registro</Label>
                          <Input
                            id="id"
                            value={user?.id || ""}
                            disabled
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Função</Label>
                        <Input
                          id="role"
                          value={user?.role === "admin" ? "Administrador" : "Colaborador"}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Alterações
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Preferências de Notificação</CardTitle>
                  <CardDescription>
                    Escolha quais notificações deseja receber
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Novos Certificados</h4>
                        <p className="text-sm text-gray-500">Receba notificações sobre novos certificados adicionados</p>
                      </div>
                      <Switch 
                        checked={notifications.newCertificates} 
                        onCheckedChange={(checked) => setNotifications({...notifications, newCertificates: checked})} 
                      />
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Certificados Expirando</h4>
                        <p className="text-sm text-gray-500">Receba alertas sobre certificados prestes a expirar</p>
                      </div>
                      <Switch 
                        checked={notifications.expiringSoon} 
                        onCheckedChange={(checked) => setNotifications({...notifications, expiringSoon: checked})} 
                      />
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Certificados Expirados</h4>
                        <p className="text-sm text-gray-500">Receba alertas sobre certificados que expiraram</p>
                      </div>
                      <Switch 
                        checked={notifications.expired} 
                        onCheckedChange={(checked) => setNotifications({...notifications, expired: checked})} 
                      />
                    </div>
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Atualizações do Sistema</h4>
                        <p className="text-sm text-gray-500">Receba notificações sobre atualizações e manutenções</p>
                      </div>
                      <Switch 
                        checked={notifications.system} 
                        onCheckedChange={(checked) => setNotifications({...notifications, system: checked})} 
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="mr-2 h-4 w-4" />
                    Salvar Preferências
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                  <CardDescription>
                    Gerencie as configurações de segurança da sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Senha Atual</Label>
                      <Input
                        id="current-password"
                        type="password"
                        placeholder="••••••••"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-password">Nova Senha</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirme a Nova Senha</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg mt-6">
                      <h4 className="font-medium text-blue-800">Dicas de Segurança</h4>
                      <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
                        <li>Use uma senha com pelo menos 8 caracteres</li>
                        <li>Inclua letras maiúsculas, minúsculas, números e símbolos</li>
                        <li>Não reutilize senhas de outros serviços</li>
                        <li>Evite informações pessoais fáceis de adivinhar</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Atualizar Senha
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
