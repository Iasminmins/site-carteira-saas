import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCertificates } from "@/contexts/CertificateContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { CertificateCard } from "@/components/CertificateCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { EmployeeCard } from "@/components/EmployeeCard";

const CertificatesManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  
  const navigate = useNavigate();
  const { certificates, employees } = useCertificates();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Get unique certificate types
  const certificateTypes = [...new Set(certificates.map((cert) => cert.type))];

  // Get unique employees
  const uniqueEmployees = [...new Set(certificates.map((cert) => cert.employeeId))];
  const employeeList = employees.filter((emp) => uniqueEmployees.includes(emp.id));

  // Filter certificates
  const filteredCertificates = certificates.filter((cert) => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    const matchesType = typeFilter === "all" || cert.type === typeFilter;
    const matchesEmployee = employeeFilter === "all" || cert.employeeId === employeeFilter;

    return matchesSearch && matchesStatus && matchesType && matchesEmployee;
  });

  const handleAddCertificate = () => {
    navigate("/admin/certificates/new");
  };

  const handleRefresh = () => {
    toast({
      title: "Lista atualizada",
      description: "Os certificados foram atualizados com sucesso.",
    });
  };

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const selectedEmployee = employeeFilter !== "all" 
    ? employees.find(emp => emp.id === employeeFilter)
    : null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleMenu} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header showMenuToggle={true} toggleSidebar={toggleMenu} />
        <div className="flex-1 overflow-y-auto">
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Certificados</h1>
                <p className="text-gray-600">Visualize e administre todos os certificados da empresa</p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  className="h-10 w-10"
                  title="Atualizar Lista"
                >
                  <RefreshCw size={18} />
                </Button>
                <Button
                  onClick={handleAddCertificate}
                  className="bg-industrial-blue hover:bg-industrial-blue/90"
                >
                  <Plus size={18} className="mr-2" />
                  Novo Certificado
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle>Filtros</CardTitle>
                <CardDescription>Filtre os certificados por diferentes critérios</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Buscar certificados..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="valid">Válidos</SelectItem>
                      <SelectItem value="expiring">Expirando</SelectItem>
                      <SelectItem value="expired">Expirados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Certificado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      {certificateTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Colaborador" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Colaboradores</SelectItem>
                      {employeeList.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Display employee card if filtered by employee */}
            {selectedEmployee && (
              <Card className="mb-6">
                <CardHeader className="pb-3">
                  <CardTitle>Carteirinha do Colaborador</CardTitle>
                </CardHeader>
                <CardContent>
                  <EmployeeCard 
                    name={selectedEmployee.name}
                    id={selectedEmployee.id}
                    photo={selectedEmployee.photo}
                    certificates={filteredCertificates}
                  />
                </CardContent>
              </Card>
            )}
            
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
                <Badge variant="outline" className="bg-blue-50">
                  {filteredCertificates.length} certificado(s)
                </Badge>
              </div>
              
              <TabsContent value="grid">
                {filteredCertificates.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredCertificates.map((cert) => (
                      <CertificateCard
                        key={cert.id}
                        {...cert}
                        showEmployee={true}
                        employeeName={employees.find((emp) => emp.id === cert.employeeId)?.name || ""}
                        employeePhoto={employees.find((emp) => emp.id === cert.employeeId)?.photo || ""}
                        onClick={() => window.open(`/certificate/${cert.id}`, '_blank')}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="text-center p-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Nenhum certificado encontrado</h3>
                    <p className="text-gray-500 mt-2">Tente ajustar os filtros ou adicionar novos certificados.</p>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="list">
                {/* List view */}
                <Card>
                  {filteredCertificates.length > 0 ? (
                    <div className="divide-y">
                      {filteredCertificates.map((cert) => (
                        <div key={cert.id} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer" onClick={() => window.open(`/certificate/${cert.id}`, '_blank')}>
                          <div className="mr-4">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200">
                              <img 
                                src={employees.find((emp) => emp.id === cert.employeeId)?.photo || ""} 
                                alt={employees.find((emp) => emp.id === cert.employeeId)?.name || ""} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{cert.title}</h4>
                            <p className="text-sm text-gray-600">{employees.find((emp) => emp.id === cert.employeeId)?.name || ""}</p>
                          </div>
                          <div className="mr-4 text-right">
                            <Badge variant="outline" className="bg-industrial-blue/10 text-industrial-blue">
                              {cert.type}
                            </Badge>
                          </div>
                          <div>
                            <Badge variant={cert.status === "valid" ? "outline" : cert.status === "expired" ? "destructive" : "secondary"}>
                              {cert.status === "valid" ? "Válido" : cert.status === "expired" ? "Expirado" : "Expirando"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium">Nenhum certificado encontrado</h3>
                      <p className="text-gray-500 mt-2">Tente ajustar os filtros ou adicionar novos certificados.</p>
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CertificatesManagement;
