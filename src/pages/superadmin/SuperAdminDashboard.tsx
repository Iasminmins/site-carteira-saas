
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Users, Award, HardDrive, FileBarChart, CalendarClock, BarChart3 } from 'lucide-react';
import { useCertificates } from '@/contexts/CertificateContext';

const SuperAdminDashboard = () => {
  const { companies, employees, certificates } = useCertificates();
  const navigate = useNavigate();
  
  // Calculate metrics
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter(c => c.isActive).length;
  const totalUsers = employees.length;
  const totalCertificates = certificates.length;
  
  // Company data for charts
  const companyUserData = companies.map(company => ({
    name: company.name,
    users: employees.filter(e => e.companyId === company.id).length
  }));
  
  const companyCertData = companies.map(company => ({
    name: company.name,
    certificates: certificates.filter(c => c.companyId === company.id).length,
    valid: certificates.filter(c => c.companyId === company.id && c.status === 'valid').length,
    expired: certificates.filter(c => c.companyId === company.id && c.status === 'expired').length,
    expiring: certificates.filter(c => c.companyId === company.id && c.status === 'expiring').length
  }));
  
  // Chart for certificate status distribution
  const statusData = [
    { name: 'Válidos', value: certificates.filter(c => c.status === 'valid').length },
    { name: 'Expirando', value: certificates.filter(c => c.status === 'expiring').length },
    { name: 'Expirados', value: certificates.filter(c => c.status === 'expired').length }
  ];
  
  const COLORS = ['#10B981', '#F59E0B', '#EF4444'];

  // Storage usage simulation (fake data)
  const storageData = [
    { name: 'Industrial Tech', used: 75, total: 100 },
    { name: 'Safety First Corp', used: 42, total: 100 }
  ];
  
  // Monthly active users simulation
  const monthlyUsers = [
    { name: 'Jan', users: 12 },
    { name: 'Feb', users: 15 },
    { name: 'Mar', users: 18 },
    { name: 'Apr', users: 22 },
    { name: 'May', users: 28 },
    { name: 'Jun', users: 32 }
  ];
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Painel de Controle - SaaS</h1>
          <p className="text-muted-foreground">Monitoramento completo da plataforma</p>
        </div>
        <Button onClick={() => navigate('/superadmin/companies')}>
          <Building2 size={18} className="mr-2" />
          Gerenciar Empresas
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Empresas Ativas</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl">{activeCompanies}</CardTitle>
              <Building2 size={28} className="text-blue-500" />
            </div>
          </CardHeader>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              Total de {totalCompanies} empresas registradas
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Colaboradores</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl">{totalUsers}</CardTitle>
              <Users size={28} className="text-emerald-500" />
            </div>
          </CardHeader>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              Distribuídos em {activeCompanies} empresas ativas
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Certificados Emitidos</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl">{totalCertificates}</CardTitle>
              <Award size={28} className="text-purple-500" />
            </div>
          </CardHeader>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              {certificates.filter(c => c.status === 'valid').length} certificados válidos
            </p>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Uso de Armazenamento</CardDescription>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl">117 MB</CardTitle>
              <HardDrive size={28} className="text-amber-500" />
            </div>
          </CardHeader>
          <CardFooter>
            <p className="text-muted-foreground text-xs">
              De 1GB alocado (11.7% utilizado)
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="metrics" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="metrics">
            <BarChart3 size={16} className="mr-2" />
            Métricas por Empresa
          </TabsTrigger>
          <TabsTrigger value="activity">
            <CalendarClock size={16} className="mr-2" />
            Atividade
          </TabsTrigger>
          <TabsTrigger value="resources">
            <FileBarChart size={16} className="mr-2" />
            Uso de Recursos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Colaboradores por Empresa</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companyUserData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" name="Colaboradores" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certificados por Empresa</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={companyCertData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valid" name="Válidos" stackId="a" fill="#10B981" />
                    <Bar dataKey="expiring" name="Expirando" stackId="a" fill="#F59E0B" />
                    <Bar dataKey="expired" name="Expirados" stackId="a" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="activity">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificados por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Usuários Ativos Mensais</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyUsers}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="users" name="Usuários" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Utilização de Armazenamento por Empresa</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={storageData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="used" name="MB Utilizados" fill="#EC4899" />
                    <Bar dataKey="total" name="MB Alocados" fill="#D1D5DB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="mb-4">Empresas Ativas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companies.map(company => (
                    <div key={company.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                          {company.logo ? (
                            <img src={company.logo} alt={company.name} className="w-10 h-10 rounded-full" />
                          ) : (
                            <Building2 size={20} className="text-gray-500" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{company.name}</h3>
                          <p className="text-xs text-muted-foreground">{company.domain}</p>
                        </div>
                      </div>
                      <Badge variant={company.isActive ? "default" : "destructive"}>
                        {company.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
