
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { FileText, Award, Badge as CertificateBadge, IdCard } from "lucide-react";
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
  const navigate = useNavigate();
  
  const validCertificates = certificates.filter(cert => cert.status === "valid").length;
  const expiringCertificates = certificates.filter(cert => cert.status === "expiring").length;
  const expiredCertificates = certificates.filter(cert => cert.status === "expired").length;
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  // Navigate to employee details
  const handleViewDetails = () => {
    navigate(`/admin/employees/${id}`);
  };
  
  // Function to print the card
  const handlePrint = () => {
    const content = document.getElementById('employee-card-print');
    const printWindow = window.open('', '_blank');
    
    if (printWindow && content) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Carteirinha Profissional - ${name}</title>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');
              body { 
                font-family: 'Roboto', sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8f8f8;
              }
              .card-container {
                width: 85.6mm; 
                height: 54mm;
                margin: 20px auto;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 10px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                position: relative;
                color: #333;
              }
              .card-header {
                background: linear-gradient(90deg, #0A2463 0%, #3E92CC 100%);
                padding: 12px;
                display: flex;
                align-items: center;
                color: white;
              }
              .company-logo {
                width: 40px;
                height: 40px;
                background: #ffcc00;
                border-radius: 50%;
                margin-right: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
              }
              .card-title {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
              }
              .card-subtitle {
                margin: 0;
                font-size: 11px;
                opacity: 0.9;
              }
              .card-body {
                padding: 12px;
                display: flex;
                flex-direction: column;
              }
              .personal-info {
                display: flex;
                margin-bottom: 15px;
              }
              .photo {
                width: 90px;
                height: 110px;
                background-color: #e0e0e0;
                border: 1px solid #ccc;
                margin-right: 15px;
                object-fit: cover;
              }
              .info {
                flex: 1;
              }
              .name {
                font-size: 14px;
                font-weight: 700;
                margin: 0 0 5px 0;
              }
              .id-number {
                font-size: 11px;
                color: #555;
                margin: 0 0 8px 0;
              }
              .validity-section {
                background-color: #f0f0f0;
                border: 1px solid #ddd;
                border-radius: 5px;
                padding: 8px;
                margin-bottom: 5px;
              }
              .validity-title {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                margin: 0 0 5px 0;
                color: #555;
                border-bottom: 1px solid #ddd;
                padding-bottom: 3px;
              }
              .certificate-list {
                font-size: 10px;
              }
              .certificate-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
              }
              .certificate-name {
                font-weight: 500;
              }
              .certificate-validity {
                color: #555;
              }
              .certificate-valid { color: #2e7d32; }
              .certificate-expiring { color: #ed6c02; }
              .certificate-expired { color: #d32f2f; }
              .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px 12px;
              }
              .qrcode {
                width: 70px;
                height: 70px;
              }
              .footer-info {
                font-size: 9px;
                color: #777;
                text-align: right;
              }
              .watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 80px;
                opacity: 0.03;
                font-weight: 700;
                pointer-events: none;
                color: #000;
                z-index: 0;
                white-space: nowrap;
              }
              .hologram {
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 25px;
                height: 25px;
                background: linear-gradient(45deg, #f3f3f3, #e0e0e0, #f3f3f3);
                border-radius: 50%;
                opacity: 0.7;
              }
              @media print {
                body { background: none; }
                .card-container { 
                  box-shadow: none;
                  border: 1px solid #ddd;
                  page-break-inside: avoid;
                  margin: 0;
                }
                @page {
                  size: 90mm 60mm;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body onload="setTimeout(function() { window.print(); }, 500)">
            <div class="card-container">
              <div class="watermark">CERTIFICADO</div>
              <div class="card-header">
                <div class="company-logo">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A2463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div>
                  <h1 class="card-title">CARTEIRINHA PROFISSIONAL</h1>
                  <p class="card-subtitle">Certificação de Treinamentos Industriais</p>
                </div>
              </div>
              
              <div class="card-body">
                <div class="personal-info">
                  <img src="${photo || 'https://via.placeholder.com/90x110?text=Foto'}" alt="${name}" class="photo">
                  <div class="info">
                    <h2 class="name">${name}</h2>
                    <p class="id-number">ID: ${id}</p>
                    
                    <div class="validity-section">
                      <h3 class="validity-title">Treinamentos Realizados</h3>
                      <div class="certificate-list">
                        ${certificates.slice(0, 6).map(cert => `
                          <div class="certificate-item">
                            <span class="certificate-name">${cert.type} - ${cert.title.length > 30 ? cert.title.substring(0, 30) + '...' : cert.title}</span>
                            <span class="certificate-validity ${
                              cert.status === 'valid' ? 'certificate-valid' : 
                              cert.status === 'expired' ? 'certificate-expired' : 
                              'certificate-expiring'
                            }">
                              ${formatDate(cert.expiryDate)}
                            </span>
                          </div>
                        `).join('')}
                        ${certificates.length > 6 ? `<div class="certificate-item">...(${certificates.length - 6} mais)</div>` : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="card-footer">
                <img src="${`https://api.qrserver.com/v1/create-qr-code/?size=70x70&data=${id}`}" alt="QR Code" class="qrcode">
                <div class="footer-info">
                  <p>Carteirinha emitida em: ${new Date().toLocaleDateString('pt-BR')}</p>
                  <p>Verifique a autenticidade pelo QR Code</p>
                </div>
                <div class="hologram"></div>
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
          <IdCard className="mr-2" size={18} />
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

