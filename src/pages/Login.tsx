
import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Lock, User, UserCircle2, Building2 } from "lucide-react";
import { Radio, RadioGroup } from "@/components/ui/radio-group";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.enum(["superadmin", "admin", "employee"]),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const { login, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("tenant");
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "employee",
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login(data.email, data.password, data.role);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Tabs defaultValue="tenant" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="tenant">
              <Building2 className="mr-2 h-4 w-4" />
              Empresa
            </TabsTrigger>
            <TabsTrigger value="platform">
              <UserCircle2 className="mr-2 h-4 w-4" />
              Plataforma
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tenant">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Carteira Digital</CardTitle>
                <CardDescription>
                  Faça login em sua conta de empresa para acessar os certificados
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="seu.email@exemplo.com"
                                type="email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="••••••"
                                type="password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Entrar como</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex space-x-4"
                            >
                              <div className="flex items-center space-x-2">
                                <Radio
                                  value="admin"
                                  id="admin"
                                  checked={field.value === "admin"}
                                />
                                <Label htmlFor="admin">Administrador</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Radio
                                  value="employee"
                                  id="employee"
                                  checked={field.value === "employee"}
                                />
                                <Label htmlFor="employee">Colaborador</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
          
          <TabsContent value="platform">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Plataforma SaaS</CardTitle>
                <CardDescription>
                  Acesso administrativo à plataforma multi-tenant
                </CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email do Administrador</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="admin@plataforma.com"
                                type="email"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                className="pl-8"
                                placeholder="••••••"
                                type="password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input type="hidden" {...form.register("role")} value="superadmin" />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      variant="secondary"
                      className="w-full"
                      disabled={isLoading}
                      onClick={() => {
                        form.setValue("role", "superadmin");
                      }}
                    >
                      {isLoading ? "Entrando..." : "Acessar como Superadmin"}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </TabsContent>
        </Tabs>
        
        <p className="mt-4 text-center text-sm text-gray-500">
          Carteira Digital de Certificados - Sistema Multi-tenant
        </p>
      </div>
    </div>
  );
}
