
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCertificates } from "@/contexts/CertificateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { FileCheck, Users, AlertTriangle, Clock, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CertificateCard } from "@/components/CertificateCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { certificates, employees } = useCertificates();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Count certificates by status
  const validCount = certificates.filter(cert => cert.status === "valid").length;
  const expiringCount = certificates.filter(cert => cert.status === "expiring").length;
  const expiredCount = certificates.filter(cert => cert.status === "expired").length;
  
  // Count unique employees
  const uniqueEmployees = new Set(certificates.map(cert => cert.employeeId)).size;
  
  // Prepare data for pie chart
  const pieData = [
    { name: "Válidos", value: validCount, color: "#10B981" },
    { name: "Expirando", value: expiringCount, color: "#F59E0B" },
    { name: "Expirados", value: expiredCount, color: "#EF4444" }
  ];
  
  // Prepare data for bar chart (certificates by type)
  const certificateTypes = certificates.reduce((acc: Record<string, number>, cert) => {
    acc[cert.type] = (acc[cert.type] || 0) + 1;
    return acc;
  }, {});
  
  const barData = Object.entries(certificateTypes).map(([type, count]) => ({
    name: type,
    count
  }));

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        
        <div className="page-container">
          <div className="max-w-7xl mx-auto p-4 md:p-6 content-wrapper">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600">Visão geral dos certificados da empresa</p>
              </div>
              
              <Button 
                onClick={() => navigate('/admin/certificates/new')}
                className="bg-industrial-blue hover:bg-industrial-blue/90"
              >
                <Plus size={18} className="mr-2" />
                Novo Certificado
              </Button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card className="card-hover">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Certificados Válidos</CardTitle>
                  <FileCheck className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{validCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Certificados ativos e em dia
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Certificados Expirando</CardTitle>
                  <Clock className="h-5 w-5 text-amber-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expiringCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Certificados próximos da validade
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Certificados Expirados</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{expiredCount}</div>
                  <p className="text-xs text-muted-foreground">
                    Certificados que precisam ser renovados
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                  <Users className="h-5 w-5 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{uniqueEmployees}</div>
                  <p className="text-xs text-muted-foreground">
                    Colaboradores com certificados
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Status dos Certificados</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} certificados`, ""]} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardHeader>
                  <CardTitle className="text-lg">Certificados por Tipo</CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip formatter={(value) => [`${value} certificados`, ""]} />
                      <Bar dataKey="count" fill="#003049" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Certificates */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Certificados Recentes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certificates.slice(0, 3).map((cert) => (
                  <CertificateCard 
                    key={cert.id} 
                    {...cert} 
                    showEmployee={true}
                    employeeName={employees.find(emp => emp.id === cert.employeeId)?.name || ""}
                    employeePhoto={employees.find(emp => emp.id === cert.employeeId)?.photo || ""}
                    onClick={() => window.open(`/certificate/${cert.id}`, '_blank')}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
