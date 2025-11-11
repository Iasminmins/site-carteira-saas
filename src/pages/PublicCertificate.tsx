
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer, Loader2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCertificates } from "@/contexts/CertificateContext";
import { generateCertificateQRCode } from "@/lib/qrcode";

const PublicCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const { getCertificate, employees } = useCertificates();
  const navigate = useNavigate();
  
  // Buscar certificado dos dados mockados
  const certificate = getCertificate(id || "");
  const employee = certificate ? employees.find(emp => emp.id === certificate.employeeId) : null;
  
  // Error or not found state
  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Certificado não encontrado</h1>
          <p className="text-gray-600 mb-6">O certificado solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate("/")} className="w-full">
            Voltar ao Início
          </Button>
        </Card>
      </div>
    );
  }
  
  const getStatusConfig = (status: string) => {
    switch(status) {
      case "valid":
        return { label: "Válido", variant: "outline", className: "bg-green-100 text-green-800 border-green-200" };
      case "expired":
        return { label: "Expirado", variant: "destructive", className: "bg-red-100 text-red-800 border-red-200" };
      case "expiring":
        return { label: "Expirando", variant: "secondary", className: "bg-amber-100 text-amber-800 border-amber-200" };
      default:
        return { label: "Indefinido", variant: "outline", className: "bg-gray-100 text-gray-800" };
    }
  };
  
  const { label, className } = getStatusConfig(certificate.status);
  
  // Gera o QR code usando a função do frontend (sempre correto)
  const qrCodeUrl = certificate.qrCode || generateCertificateQRCode(certificate.id);

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="max-w-md mx-auto mt-8">
            <div className="flex justify-between items-center mb-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={18} className="mr-2" />
                Voltar
              </Button>
              
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Printer size={18} className="mr-2" />
                Imprimir
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border max-w-md mx-auto animate-fade-in print:shadow-none print:border">
              {/* Header */}
              <div className="bg-industrial-blue text-white p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                    <div className="h-6 w-6 rounded-full bg-industrial-yellow"></div>
                  </div>
                  <div>
                    <h1 className="text-lg font-bold">Carteira Digital</h1>
                    <p className="text-xs opacity-90">Verificação de Certificado</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Status Badges */}
                <div className="flex justify-between items-center">
                  <Badge className={className}>
                    {label}
                  </Badge>
                  <Badge variant="outline" className="bg-industrial-blue/10 text-industrial-blue">
                    {certificate.type}
                  </Badge>
                </div>
                
                {/* Employee Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {employee?.photo && (
                      <img 
                        src={employee.photo} 
                        alt={employee.name} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base truncate">
                      {employee?.name || certificate.employeeName || 'Funcionário'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      ID: {certificate.employeeId || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {/* Certificate Title */}
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-medium mb-1">Certificado:</p>
                  <p className="text-sm font-semibold text-gray-900">{certificate.title}</p>
                </div>
                
                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Data de Emissão</p>
                    <p className="text-sm font-semibold">{format(new Date(certificate.issuedDate), 'dd/MM/yyyy')}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Validade</p>
                    <p className={`text-sm font-semibold ${
                      certificate.status === "valid" 
                        ? "text-green-600" 
                        : certificate.status === "expired"
                          ? "text-red-600"
                          : "text-amber-600"
                    }`}>
                      {format(new Date(certificate.expiryDate), 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                
                {/* QR Code */}
                <div className="flex justify-center py-3">
                  <div className="relative p-3 bg-white border-2 border-gray-200 rounded-lg">
                    <img 
                      src={qrCodeUrl}
                      alt="QR Code" 
                      className="w-24 h-24 object-contain"
                    />
                  </div>
                </div>
                
                {/* Footer Info */}
                <div className="text-center space-y-1 pt-2 border-t">
                  <p className="text-xs text-gray-600">
                    Este certificado pode ser verificado através do QR Code
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    ID: {certificate.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-16"></div> {/* Extra space at the bottom for better scrolling */}
        </div>
      </div>
    </div>
  );
};

export default PublicCertificate;
