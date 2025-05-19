
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCertificates } from "@/contexts/CertificateContext";
import { Header } from "@/components/Header";
import { CertificateCard } from "@/components/CertificateCard";
import { EmployeeCard } from "@/components/EmployeeCard";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Certificate } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeeCertificates = () => {
  const { user } = useAuth();
  const { getEmployeeCertificates } = useCertificates();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Get certificates for the logged in employee
  const employeeCertificates = user ? getEmployeeCertificates(user.id) : [];
  
  const filteredCertificates = employeeCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const validCount = employeeCertificates.filter(cert => cert.status === "valid").length;
  const expiringCount = employeeCertificates.filter(cert => cert.status === "expiring").length;
  const expiredCount = employeeCertificates.filter(cert => cert.status === "expired").length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header showMenuToggle={false} />
      
      <main className="flex-1 p-4 pb-16 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Employee Info Card */}
          <Card className="mb-6 overflow-hidden border-0 shadow-lg">
            <div className="h-24 bg-gradient-to-r from-industrial-blue to-blue-600"></div>
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-10 mb-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow">
                  <AvatarImage src={user?.photo} />
                  <AvatarFallback className="bg-industrial-blue text-white text-xl">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 sm:mt-0 sm:ml-4 text-center sm:text-left">
                  <h1 className="text-xl font-bold">{user?.name}</h1>
                  <p className="text-sm text-gray-600">ID: {user?.id}</p>
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
              
              {/* Botão de Carteirinha */}
              {user && (
                <EmployeeCard
                  name={user.name}
                  id={user.id}
                  photo={user.photo}
                  certificates={employeeCertificates}
                />
              )}
            </CardContent>
          </Card>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar certificados..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="valid">Válidos</SelectItem>
                <SelectItem value="expiring">Expirando</SelectItem>
                <SelectItem value="expired">Expirados</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Certificates Grid */}
          {filteredCertificates.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </main>
    </div>
  );
};

export default EmployeeCertificates;
