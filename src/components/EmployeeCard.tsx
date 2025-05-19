
import { useState } from "react";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { FileText, Award, Badge as CertificateBadge } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EmployeeCardProps {
  name: string;
  id: string;
  photo?: string;
  certificates: {
    id: string;
    title: string;
    type: string;
    issuedDate: Date;
    expiryDate: Date;
    status: "valid" | "expired" | "expiring";
  }[];
}

export function EmployeeCard({ name, id, photo, certificates }: EmployeeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const validCertificates = certificates.filter(cert => cert.status === "valid").length;
  const expiringCertificates = certificates.filter(cert => cert.status === "expiring").length;
  const expiredCertificates = certificates.filter(cert => cert.status === "expired").length;
  
  // Formatar data para exibição
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  // Função para imprimir a carteirinha
  const handlePrint = () => {
    const content = document.getElementById('employee-card-print');
    const printWindow = window.open('', '_blank');
    
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Carteirinha de Certificados - ${name}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .card { border: 1px solid #ccc; padding: 20px; max-width: 800px; margin: 0 auto; }
              .header { display: flex; align-items: center; margin-bottom: 20px; }
              .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-right: 20px; }
              .avatar-fallback { width: 100px; height: 100px; border-radius: 50%; background-color: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; color: #64748b; margin-right: 20px; }
              .info { flex: 1; }
              .name { font-size: 24px; font-weight: bold; margin: 0; }
              .id { font-size: 14px; color: #64748b; margin: 5px 0; }
              .status { display: flex; gap: 10px; margin-top: 10px; }
              .status-item { padding: 5px 10px; border-radius: 5px; font-size: 12px; }
              .valid { background-color: #dcfce7; color: #166534; }
              .expiring { background-color: #fef3c7; color: #92400e; }
              .expired { background-color: #fee2e2; color: #b91c1c; }
              .certificates { margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              .certificate { padding: 10px; border: 1px solid #e2e8f0; margin-bottom: 10px; border-radius: 5px; }
              .certificate-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .certificate-title { font-weight: bold; margin: 0; }
              .certificate-type { background-color: #e0e7ff; color: #4338ca; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
              .certificate-dates { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; }
              .status-badge { font-size: 12px; padding: 2px 6px; border-radius: 3px; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #64748b; }
            </style>
          </head>
          <body onload="window.print()">
            <div class="card">
              <div class="header">
                ${photo 
                  ? `<img src="${photo}" alt="${name}" class="avatar" />`
                  : `<div class="avatar-fallback">${name.split(' ').map(n => n[0]).join('')}</div>`
                }
                <div class="info">
                  <h1 class="name">${name}</h1>
                  <p class="id">ID: ${id}</p>
                  <div class="status">
                    <span class="status-item valid">Válidos: ${validCertificates}</span>
                    <span class="status-item expiring">Expirando: ${expiringCertificates}</span>
                    <span class="status-item expired">Expirados: ${expiredCertificates}</span>
                  </div>
                </div>
              </div>
              <div class="certificates">
                <h2>Certificados</h2>
                ${certificates.map(cert => `
                  <div class="certificate">
                    <div class="certificate-header">
                      <p class="certificate-title">${cert.title}</p>
                      <span class="certificate-type">${cert.type}</span>
                    </div>
                    <div class="certificate-dates">
                      <span>Emissão: ${formatDate(cert.issuedDate)}</span>
                      <span>Validade: ${formatDate(cert.expiryDate)}</span>
                      <span class="status-badge ${cert.status === 'valid' ? 'valid' : cert.status === 'expired' ? 'expired' : 'expiring'}">
                        ${cert.status === 'valid' ? 'Válido' : cert.status === 'expired' ? 'Expirado' : 'Expirando'}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
              <div class="footer">
                <p>Carteirinha gerada em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          <Award className="mr-2" size={18} />
          Gerar Carteirinha
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Carteirinha de Certificados</DialogTitle>
        </DialogHeader>
        
        <div id="employee-card-print" className="mt-4">
          <Card className="border-2">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={photo} alt={name} />
                  <AvatarFallback className="text-lg">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{name}</CardTitle>
                  <p className="text-sm text-muted-foreground">ID: {id}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                      Válidos: {certificates.filter(cert => cert.status === "valid").length}
                    </Badge>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Expirando: {certificates.filter(cert => cert.status === "expiring").length}
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Expirados: {certificates.filter(cert => cert.status === "expired").length}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <CertificateBadge className="mr-2" size={18} />
                Certificados ({certificates.length})
              </h3>
              
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="border rounded-md p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{cert.title}</h4>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        {cert.type}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground">Emissão: </span>
                        {formatDate(cert.issuedDate)}
                      </div>
                      <div>
                        <span className="text-muted-foreground">Validade: </span>
                        <span className={
                          cert.status === "valid" 
                            ? "text-green-600" 
                            : cert.status === "expired" 
                              ? "text-red-600" 
                              : "text-amber-600"
                        }>
                          {formatDate(cert.expiryDate)}
                        </span>
                      </div>
                      <Badge 
                        variant={
                          cert.status === "valid" 
                            ? "outline" 
                            : cert.status === "expired" 
                              ? "destructive" 
                              : "secondary"
                        }
                        className={cert.status === "valid" ? "bg-green-100 text-green-800 border-green-200" : ""}
                      >
                        {cert.status === "valid" 
                          ? "Válido" 
                          : cert.status === "expired" 
                            ? "Expirado" 
                            : "Expirando"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button onClick={handlePrint}>
            Imprimir Carteirinha
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
