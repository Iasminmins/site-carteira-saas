
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Printer, Loader2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCertificateService } from "@/services/certificateService";

const PublicCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const { useCertificateWithEmployee } = useCertificateService();
  const navigate = useNavigate();
  
  // Buscar certificado da API com dados do funcionário
  const { data: certificate, isLoading, error } = useCertificateWithEmployee(id || "");
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 max-w-md w-full text-center shadow-xl">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-industrial-blue" />
          <p className="text-gray-600">Carregando certificado...</p>
        </Card>
      </div>
    );
  }
  
  // Error or not found state
  if (!certificate || error) {
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
                    {certificate.employeeId?.photo && (
                      <img 
                        src={certificate.employeeId.photo} 
                        alt={certificate.employeeId.name} 
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-base truncate">
                      {certificate.employeeId?.name || 'Funcionário'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Matrícula: {certificate.employeeId?.matricula || 'N/A'}
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
                      src={certificate.qrCode} 
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
                    ID: {certificate._id || certificate.id}
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
