
import { useState } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useCertificates } from "@/contexts/CertificateContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const NewCertificate = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [issuedDate, setIssuedDate] = useState<Date | undefined>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  
  const navigate = useNavigate();
  const { addCertificate, isLoading } = useCertificates();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !type || !employeeId || !employeeName || !issuedDate || !expiryDate) {
      toast.error("Todos os campos são obrigatórios");
      return;
    }
    
    // Determine status based on expiry date
    const today = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    
    let status: "valid" | "expired" | "expiring";
    
    if (expiryDate < today) {
      status = "expired";
    } else if (expiryDate < threeMonthsFromNow) {
      status = "expiring";
    } else {
      status = "valid";
    }
    
    addCertificate({
      title,
      type,
      issuedDate,
      expiryDate,
      status,
      employeeId,
      employeeName,
      employeePhoto: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}` // Random avatar for demo
    });
    
    navigate("/admin/certificates");
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex-1 flex flex-col overflow-hidden lg:pl-64">
        <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/admin/certificates")}
              className="mb-4"
            >
              <ArrowLeft size={18} className="mr-2" />
              Voltar
            </Button>
            
            <h1 className="text-2xl font-bold text-gray-900">Novo Certificado</h1>
            <p className="text-gray-600">Cadastre um novo certificado para um colaborador</p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Informações do Certificado</CardTitle>
              <CardDescription>
                Preencha todos os campos para gerar um novo certificado com QR Code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título do Certificado</Label>
                    <Input 
                      id="title" 
                      value={title} 
                      onChange={(e) => setTitle(e.target.value)} 
                      placeholder="Ex: NR-10 - Segurança em Instalações Elétricas"
                      className="mt-1"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger id="type" className="mt-1">
                        <SelectValue placeholder="Selecione o tipo de certificado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NR">NR - Norma Regulamentadora</SelectItem>
                        <SelectItem value="ISO">ISO</SelectItem>
                        <SelectItem value="CIPA">CIPA</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="employeeId">ID do Colaborador</Label>
                      <Input 
                        id="employeeId" 
                        value={employeeId} 
                        onChange={(e) => setEmployeeId(e.target.value)} 
                        placeholder="Ex: 12345"
                        className="mt-1"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="employeeName">Nome do Colaborador</Label>
                      <Input 
                        id="employeeName" 
                        value={employeeName} 
                        onChange={(e) => setEmployeeName(e.target.value)} 
                        placeholder="Ex: João Silva"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Data de Emissão</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !issuedDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {issuedDate ? format(issuedDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={issuedDate}
                            onSelect={setIssuedDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label>Data de Validade</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full mt-1 justify-start text-left font-normal",
                              !expiryDate && "text-muted-foreground"
                            )}
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            {expiryDate ? format(expiryDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={expiryDate}
                            onSelect={setExpiryDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => navigate("/admin/certificates")}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-industrial-blue hover:bg-industrial-blue/90 btn-hover"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando..." : "Criar Certificado"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default NewCertificate;
