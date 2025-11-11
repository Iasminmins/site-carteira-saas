
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCertificates } from "@/contexts/CertificateContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus,
  Search,
  RefreshCw,
  User,
  Award,
  FileText,
  ChevronRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeCard } from "@/components/EmployeeCard";
import { EmployeeQRCodeDisplay } from "@/components/EmployeeQRCodeDisplay";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const EmployeesManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { employees, certificates } = useCertificates();
  const { toast } = useToast();
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeId, setNewEmployeeId] = useState("");
  const navigate = useNavigate();

  // Filter employees based on search query
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group certificates by employee
  const employeeCertificatesCount = filteredEmployees.map(emp => {
    const empCerts = certificates.filter(cert => cert.employeeId === emp.id);
    
    return {
      ...emp,
      total: empCerts.length,
      valid: empCerts.filter(c => c.status === "valid").length,
      expiring: empCerts.filter(c => c.status === "expiring").length,
      expired: empCerts.filter(c => c.status === "expired").length,
    };
  });

  const handleRefresh = () => {
    toast({
      title: "Lista atualizada",
      description: "A lista de colaboradores foi atualizada com sucesso.",
    });
  };

  const handleViewDetails = (employeeId: string) => {
    navigate(`/admin/employees/${employeeId}`);
  };

  const handleAddEmployee = () => {
    if (!newEmployeeName || !newEmployeeId) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Colaborador adicionado",
      description: `${newEmployeeName} foi adicionado com sucesso.`,
    });
    
    setShowAddEmployee(false);
    setNewEmployeeName("");
    setNewEmployeeId("");
  };

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleMenu} showMenuToggle={true} />
        <div className="flex-1 overflow-y-auto lg:ml-16">
          <main className="p-4 md:p-6 max-w-7xl mx-auto pb-20">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Gerenciamento de Colaboradores</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">Visualize e administre todos os colaboradores</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRefresh}
                    className="h-10 w-10 flex-shrink-0"
                    title="Atualizar Lista"
                  >
                    <RefreshCw size={18} />
                  </Button>
                  <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-industrial-blue hover:bg-industrial-blue/90 flex-1 sm:flex-initial"
                      >
                        <Plus size={18} className="mr-2" />
                        <span className="hidden sm:inline">Novo Colaborador</span>
                        <span className="sm:hidden">Novo</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
                        <DialogDescription>
                          Preencha os dados para cadastrar um novo colaborador
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">Nome Completo</label>
                          <Input 
                            id="name" 
                            value={newEmployeeName} 
                            onChange={(e) => setNewEmployeeName(e.target.value)} 
                            placeholder="Ex: João da Silva"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="id" className="text-sm font-medium">ID / Registro</label>
                          <Input 
                            id="id" 
                            value={newEmployeeId} 
                            onChange={(e) => setNewEmployeeId(e.target.value)}
                            placeholder="Ex: 12345"
                          />
                        </div>
                        <div className="pt-4 flex justify-end">
                          <Button onClick={handleAddEmployee}>
                            Adicionar Colaborador
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>

              {/* Search */}
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Buscar Colaborador</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar por nome ou ID..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Employee List */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Colaboradores</CardTitle>
                  <CardDescription>Total de {filteredEmployees.length} colaboradores</CardDescription>
                </CardHeader>
                <CardContent>
                  {filteredEmployees.length > 0 ? (
                    <div className="space-y-4">
                      {employeeCertificatesCount.map((emp) => (
                        <Card key={emp.id} className="overflow-hidden">
                          <div className="flex flex-col">
                            {/* Employee Info - Mobile First */}
                            <div className="flex items-center p-4">
                              <Avatar className="h-12 w-12 mr-3 flex-shrink-0 border-2 border-industrial-blue">
                                <AvatarImage src={emp.photo} />
                                <AvatarFallback className="bg-industrial-blue text-white">
                                  {emp.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{emp.name}</h4>
                                <p className="text-sm text-gray-600 truncate">ID: {emp.id}</p>
                              </div>
                            </div>
                            
                            {/* Stats - Mobile Friendly Grid */}
                            <div className="grid grid-cols-2 border-t">
                              <div className="p-4 border-r bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-gray-600">Certificados</span>
                                  <FileText size={14} className="text-gray-400" />
                                </div>
                                <Badge variant="outline" className="bg-white text-gray-800 text-xs">
                                  Total: {emp.total}
                                </Badge>
                              </div>
                              
                              <div className="p-4 bg-gray-50">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-xs text-gray-600">Status</span>
                                  <Award size={14} className="text-gray-400" />
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200 text-xs px-1.5 py-0">
                                    {emp.valid}
                                  </Badge>
                                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200 text-xs px-1.5 py-0">
                                    {emp.expiring}
                                  </Badge>
                                  <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200 text-xs px-1.5 py-0">
                                    {emp.expired}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            {/* Actions - Full Width on Mobile */}
                            <div className="p-4 border-t flex flex-col gap-2">
                              <div className="flex gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => handleViewDetails(emp.id)}
                                >
                                  Ver Detalhes
                                  <ChevronRight size={16} className="ml-2" />
                                </Button>
                                <EmployeeQRCodeDisplay 
                                  employeeId={emp.id}
                                  employeeName={emp.name}
                                />
                              </div>
                              <EmployeeCard
                                name={emp.name}
                                id={emp.id}
                                photo={emp.photo}
                                certificates={certificates.filter(cert => cert.employeeId === emp.id)}
                              />
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Nenhum colaborador encontrado</h3>
                      <p className="text-gray-500 mt-2">Tente uma busca diferente ou adicione novos colaboradores.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </main>
        </div>
      </div>
    </div>
  );
};

export default EmployeesManagement;
