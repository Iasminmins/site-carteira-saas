
import { useParams } from "react-router-dom";
import { useCertificates } from "@/contexts/CertificateContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PublicCertificate = () => {
  const { id } = useParams<{ id: string }>();
  const { getCertificate } = useCertificates();
  const navigate = useNavigate();
  
  const certificate = id ? getCertificate(id) : undefined;
  
  if (!certificate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2">Certificado não encontrado</h1>
          <p className="text-gray-600 mb-4">O certificado solicitado não existe ou foi removido.</p>
          <Button onClick={() => navigate("/")}>Voltar ao Início</Button>
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
  
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto mt-8">
        <Button 
          variant="ghost" 
          onClick={() => window.close()}
          className="mb-4"
        >
          <ArrowLeft size={18} className="mr-2" />
          Voltar
        </Button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border animate-fade-in">
          <div className="bg-industrial-blue text-white p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-industrial-yellow"></div>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold">Carteira Digital</h1>
                <p className="text-sm opacity-80">Verificação de Certificado</p>
              </div>
            </div>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-6">
              <Badge className={className}>
                {label}
              </Badge>
              <Badge variant="outline" className="bg-industrial-blue/10 text-industrial-blue">
                {certificate.type}
              </Badge>
            </div>
            
            <div className="flex mb-6">
              <div className="h-20 w-20 rounded overflow-hidden bg-gray-200 flex-shrink-0">
                {certificate.employeePhoto && (
                  <img 
                    src={certificate.employeePhoto} 
                    alt={certificate.employeeName} 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-lg">{certificate.employeeName}</h2>
                <p className="text-sm text-gray-600">ID: {certificate.employeeId}</p>
              </div>
            </div>
            
            <div className="border-t border-b py-4 mb-4">
              <h3 className="font-medium mb-1">Certificado:</h3>
              <p>{certificate.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Data de Emissão:</p>
                <p className="font-medium">{format(new Date(certificate.issuedDate), 'dd/MM/yyyy')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Data de Validade:</p>
                <p className={`font-medium ${
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
            
            <div className="flex justify-center mb-4">
              <img src={certificate.qrCode} alt="QR Code" className="h-32 w-32" />
            </div>
            
            <div className="text-center text-xs text-gray-500">
              <p>Este certificado pode ser verificado através do QR Code.</p>
              <p className="mt-1">ID: {certificate.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicCertificate;
