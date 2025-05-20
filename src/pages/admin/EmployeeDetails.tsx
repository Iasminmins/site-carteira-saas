
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCertificates } from "@/contexts/CertificateContext";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Search } from "lucide-react";
import { CertificateCard } from "@/components/CertificateCard";
import { EmployeeCard } from "@/components/EmployeeCard";

const EmployeeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { employees, certificates } = useCertificates();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const employee = employees.find(emp => emp.id === id);
  
  if (!employee) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1">
          <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} showMenuToggle={true} />
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            <Card className="text-center p-8">
              <h2 className="text-xl font-semibold mb-2">Colaborador não encontrado</h2>
              <p className="mb-4 text-gray-600">O colaborador solicitado não existe ou foi removido.</p>
              <Button onClick={() => navigate("/admin/employees")}>Voltar para Lista</Button>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  // Get certificates for this employee
  const employeeCertificates = certificates.filter(cert => cert.employeeId === employee.id);
  
  // Filter certificates based on search and status
  const filteredCertificates = employeeCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const validCount = employeeCertificates.filter(cert => cert.status === "valid").length;
  const expiringCount = employeeCertificates.filter(cert => cert.status === "expiring").length;
  const expiredCount = employeeCertificates.filter(cert => cert.status === "expired").length;

  const toggleMenu = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleMenu} />
      <div className="flex-1">
        <Header toggleSidebar={toggleMenu} showMenuToggle={true} />
        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          {/* Back button */}
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/admin/employees")}
          >
            <ArrowLeft size={16} className="mr-2" />
            Voltar para Lista
          </Button>
          
          {/* Employee Info Card */}
          <Card className="mb-6 overflow-hidden border-0 shadow-lg">
            <div className="h-24 bg-gradient-to-r from-industrial-blue to-blue-600"></div>
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-10 mb-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow">
                  <AvatarImage src={employee.photo} />
                  <AvatarFallback className="bg-industrial-blue text-white text-2xl">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{employee.name}</h1>
                  <p className="text-sm text-gray-600">ID: {employee.id}</p>
                </div>
                <div className="flex-1 flex justify-end mt-4 sm:mt-0">
                  <EmployeeCard
                    name={employee.name}
                    id={employee.id}
                    photo={employee.photo}
                    certificates={employeeCertificates}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-green-100 rounded-md">
                  <p className="text-sm text-green-800 font-medium">{validCount}</p>
                  <p className="text-xs text-green-600">Válidos</p>
                </div>
                <div className="text-center p-2 bg-amber-100 rounded-md">
                  <p className="text-sm text-amber-800 font-medium">{expiringCount}</p>
                  <p className="text-xs text-amber-600">Expirando</p>
                </div>
                <div className="text-center p-2 bg-red-100 rounded-md">
                  <p className="text-sm text-red-800 font-medium">{expiredCount}</p>
                  <p className="text-xs text-red-600">Expirados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Certificates Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <CardTitle>Certificados do Colaborador</CardTitle>
                <div className="relative w-full md:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Buscar certificados..."
                    className="pl-10 max-w-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full" onValueChange={value => setStatusFilter(value)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="valid">Válidos</TabsTrigger>
                  <TabsTrigger value="expiring">Expirando</TabsTrigger>
                  <TabsTrigger value="expired">Expirados</TabsTrigger>
                </TabsList>
                
                <TabsContent value={statusFilter}>
                  {filteredCertificates.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredCertificates.map((cert) => (
                        <CertificateCard
                          key={cert.id}
                          {...cert}
                          onClick={() => window.open(`/certificate/${cert.id}`, '_blank')}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg border">
                      <p className="text-gray-500">Nenhum certificado encontrado.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetails;
