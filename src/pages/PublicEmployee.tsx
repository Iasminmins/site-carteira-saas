import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, Calendar, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useCertificates } from "@/contexts/CertificateContext";


const PublicEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { employees, getEmployeeCertificates } = useCertificates();
  
  // Buscar dados do funcionário dos mockados
  const employee = employees.find(emp => emp.id === id);
  
  // Buscar certificados do funcionário
  const certificates = employee ? getEmployeeCertificates(employee.id) : [];
  
  // Error or not found state
  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-industrial-blue to-industrial-gray p-4">
        <Card className="p-8 max-w-md w-full text-center shadow-2xl">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Funcionário não encontrado</h1>
          <p className="text-gray-600 mb-6">O funcionário solicitado não existe ou foi removido.</p>
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
        return { 
          label: "Válido", 
          icon: CheckCircle,
          className: "bg-green-50 text-green-700 border-green-200",
          badgeClassName: "bg-green-100 text-green-800"
        };
      case "expired":
        return { 
          label: "Expirado", 
          icon: XCircle,
          className: "bg-red-50 text-red-700 border-red-200",
          badgeClassName: "bg-red-100 text-red-800"
        };
      case "expiring":
        return { 
          label: "Expirando", 
          icon: AlertCircle,
          className: "bg-amber-50 text-amber-700 border-amber-200",
          badgeClassName: "bg-amber-100 text-amber-800"
        };
      default:
        return { 
          label: "Indefinido", 
          icon: Shield,
          className: "bg-gray-50 text-gray-700 border-gray-200",
          badgeClassName: "bg-gray-100 text-gray-800"
        };
    }
  };

  const validCerts = certificates.filter(c => c.status === "valid").length;
  const expiringCerts = certificates.filter(c => c.status === "expiring").length;
  const expiredCerts = certificates.filter(c => c.status === "expired").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-industrial-blue via-gray-50 to-industrial-gray py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="mb-6 shadow-xl border-2 border-industrial-blue/20">
          <CardHeader className="bg-gradient-to-r from-industrial-blue to-industrial-blue/80 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                <img 
                  src={employee.photo} 
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-1">{employee.name}</CardTitle>
                <p className="text-white/90 text-sm">ID: {employee._id || employee.id}</p>
              </div>
              <Shield className="w-12 h-12 text-white/20" />
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="text-2xl font-bold text-green-700">{validCerts}</div>
                <div className="text-xs text-green-600 mt-1">Válidos</div>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="text-2xl font-bold text-amber-700">{expiringCerts}</div>
                <div className="text-xs text-amber-600 mt-1">Expirando</div>
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="text-2xl font-bold text-red-700">{expiredCerts}</div>
                <div className="text-xs text-red-600 mt-1">Expirados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-industrial-blue" />
            Certificados e Cursos
          </h2>
          
          {certificates.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-gray-500">Nenhum certificado encontrado para este funcionário.</p>
            </Card>
          ) : (
            certificates.map((cert) => {
              const statusConfig = getStatusConfig(cert.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <Card 
                  key={cert.id} 
                  className={`shadow-lg hover:shadow-xl transition-all border-2 ${statusConfig.className}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={statusConfig.badgeClassName}>
                            {cert.type}
                          </Badge>
                          <Badge variant="outline" className={statusConfig.badgeClassName}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg leading-tight">
                          {cert.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Emissão</div>
                          <div className="font-medium">
                            {format(cert.issuedDate, "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-xs text-gray-500">Validade</div>
                          <div className={`font-medium ${
                            cert.status === 'expired' ? 'text-red-600' : 
                            cert.status === 'expiring' ? 'text-amber-600' : 
                            'text-green-600'
                          }`}>
                            {format(cert.expiryDate, "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Carteira Digital de Treinamentos
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Verificado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicEmployee;
