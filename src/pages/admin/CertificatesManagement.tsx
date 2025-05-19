
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useCertificates } from "@/contexts/CertificateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CertificateCard } from "@/components/CertificateCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CertificatesManagement = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
  
  const { certificates, getCertificate } = useCertificates();
  const navigate = useNavigate();
  
  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.employeeName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const selectedCertificate = certificatePreview ? getCertificate(certificatePreview) : null;
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Certificados</h1>
              <p className="text-gray-600">Gerencie todos os certificados da empresa</p>
            </div>
            
            <Button 
              onClick={() => navigate('/admin/certificates/new')}
              className="bg-industrial-blue hover:bg-industrial-blue/90 btn-hover"
            >
              <Plus size={18} className="mr-2" />
              Novo Certificado
            </Button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar certificados ou colaboradores..."
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((cert) => (
                <Dialog key={cert.id}>
                  <DialogTrigger asChild>
                    <div onClick={() => setCertificatePreview(cert.id)}>
                      <CertificateCard 
                        {...cert} 
                        showEmployee={true}
                      />
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Pré-visualização do Certificado</DialogTitle>
                    </DialogHeader>
                    {selectedCertificate && (
                      <Tabs defaultValue="card" className="w-full">
                        <TabsList className="grid grid-cols-2">
                          <TabsTrigger value="card">Carteirinha</TabsTrigger>
                          <TabsTrigger value="qr">QR Code</TabsTrigger>
                        </TabsList>
                        <TabsContent value="card" className="mt-4">
                          <div className="border rounded-lg overflow-hidden bg-white p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-industrial-blue flex items-center justify-center">
                                  <div className="h-6 w-6 rounded-full bg-industrial-yellow"></div>
                                </div>
                                <h3 className="ml-2 font-semibold text-lg">Carteira Digital</h3>
                              </div>
                              <div className="bg-gradient-to-r from-industrial-blue to-blue-700 text-white px-3 py-1 rounded-full text-xs font-medium">
                                Certificado
                              </div>
                            </div>
                            
                            <div className="flex mb-4">
                              <div className="h-20 w-20 rounded bg-gray-200 flex-shrink-0">
                                {selectedCertificate.employeePhoto && (
                                  <img 
                                    src={selectedCertificate.employeePhoto} 
                                    alt={selectedCertificate.employeeName} 
                                    className="h-full w-full object-cover rounded"
                                  />
                                )}
                              </div>
                              <div className="ml-3">
                                <h4 className="font-semibold">{selectedCertificate.employeeName}</h4>
                                <p className="text-sm text-gray-600">ID: {selectedCertificate.id}</p>
                                <div className={`text-xs mt-1 inline-block px-2 py-1 rounded-full ${
                                  selectedCertificate.status === "valid" 
                                    ? "bg-green-100 text-green-800" 
                                    : selectedCertificate.status === "expired"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-amber-100 text-amber-800"
                                }`}>
                                  {selectedCertificate.status === "valid" 
                                    ? "Válido" 
                                    : selectedCertificate.status === "expired"
                                      ? "Expirado"
                                      : "Expirando"}
                                </div>
                              </div>
                            </div>
                            
                            <div className="border-t pt-3 mb-3">
                              <h5 className="text-sm font-medium mb-1">Certificado:</h5>
                              <p className="text-sm">{selectedCertificate.title}</p>
                            </div>
                            
                            <div className="flex justify-between text-sm">
                              <div>
                                <p className="text-gray-600">Emissão:</p>
                                <p>{new Date(selectedCertificate.issuedDate).toLocaleDateString()}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-600">Validade:</p>
                                <p>{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-center">
                              <img 
                                src={selectedCertificate.qrCode} 
                                alt="QR Code" 
                                className="h-24 w-24"
                              />
                            </div>
                          </div>
                        </TabsContent>
                        <TabsContent value="qr">
                          <div className="flex flex-col items-center">
                            <img 
                              src={selectedCertificate.qrCode} 
                              alt="QR Code" 
                              className="h-48 w-48"
                            />
                            <p className="mt-4 text-sm text-center text-gray-600">
                              Escaneie este QR Code para ver o certificado
                            </p>
                            <div className="mt-4 flex gap-2">
                              <Button variant="outline">Imprimir</Button>
                              <Button>Compartilhar</Button>
                            </div>
                          </div>
                        </TabsContent>
                      </Tabs>
                    )}
                  </DialogContent>
                </Dialog>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">Nenhum certificado encontrado.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CertificatesManagement;
