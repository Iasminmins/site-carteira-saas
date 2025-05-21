
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
import { FileText, Award, Badge as CertificateBadge, IdCard, QrCode } from "lucide-react";
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
    qrCode?: string;
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
              @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;700&display=swap');
              body { 
                font-family: 'Open Sans', Arial, sans-serif; 
                margin: 0; 
                padding: 0; 
                background-color: #f8f8f8;
              }
              .card-container {
                width: 10.6cm; 
                height: 6.6cm;
                margin: 20px auto;
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                position: relative;
                color: #333;
                padding: 0;
                box-sizing: border-box;
              }
              .card-header {
                background: linear-gradient(90deg, #0A2463 0%, #3E92CC 100%);
                padding: 8px 12px;
                display: flex;
                align-items: center;
                color: white;
                width: 100%;
                box-sizing: border-box;
              }
              .company-logo {
                width: 24px;
                height: 24px;
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
                font-size: 14px;
                font-weight: 700;
              }
              .card-body {
                padding: 12px;
                display: flex;
                flex-direction: row;
                box-sizing: border-box;
              }
              .personal-info {
                width: 40%;
                padding-right: 10px;
              }
              .certificates-info {
                width: 60%;
                border-left: 1px solid #ddd;
                padding-left: 10px;
              }
              .photo {
                width: 70px;
                height: 90px;
                background-color: #e0e0e0;
                border: 1px solid #ccc;
                margin-bottom: 8px;
                object-fit: cover;
                display: block;
              }
              .name {
                font-size: 14pt;
                font-weight: 700;
                margin: 0 0 5px 0;
                line-height: 1.2;
              }
              .id-number {
                font-size: 11px;
                color: #555;
                margin: 0 0 8px 0;
              }
              .certificate-title {
                font-size: 11px;
                font-weight: 700;
                text-transform: uppercase;
                margin: 0 0 5px 0;
                color: #555;
                border-bottom: 1px solid #ddd;
                padding-bottom: 3px;
              }
              .certificate-list {
                font-size: 10pt;
              }
              .certificate-item {
                display: flex;
                justify-content: space-between;
                margin-bottom: 6px;
                padding-bottom: 4px;
                border-bottom: 1px dotted #ccc;
              }
              .certificate-name {
                font-weight: 500;
                width: 60%;
                line-height: 1.2;
                word-wrap: break-word;
              }
              .certificate-validity {
                width: 40%;
                text-align: right;
                font-size: 10px;
              }
              .certificate-valid { color: #2e7d32; }
              .certificate-expiring { color: #ed6c02; }
              .certificate-expired { color: #d32f2f; }
              .card-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 12px 12px;
                font-size: 9px;
                color: #777;
              }
              .qrcode {
                width: 60px;
                height: 60px;
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
              @media print {
                body { background: none; }
                .card-container { 
                  box-shadow: none;
                  border: 1px solid #ddd;
                  page-break-inside: avoid;
                  margin: 0;
                }
                @page {
                  size: 11cm 7cm;
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
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0A2463" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <div>
                  <h1 class="card-title">CARTEIRINHA PROFISSIONAL</h1>
                </div>
              </div>
              
              <div class="card-body">
                <div class="personal-info">
                  <img src="${photo || 'https://via.placeholder.com/70x90?text=Foto'}" alt="${name}" class="photo">
                  <h2 class="name">${name}</h2>
                  <p class="id-number">ID: ${id}</p>
                </div>
                
                <div class="certificates-info">
                  <h3 class="certificate-title">Treinamentos Realizados</h3>
                  <div class="certificate-list">
                    ${certificates.slice(0, 6).map(cert => `
                      <div class="certificate-item">
                        <span class="certificate-name">${cert.type}</span>
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
              
              <div class="card-footer">
                <img src="${`https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${window.location.origin}/certificate/${id}`}" alt="QR Code" class="qrcode">
                <div>
                  <p>Carteirinha emitida em: ${new Date().toLocaleDateString('pt-BR')}</p>
                  <p>Verifique a autenticidade pelo QR Code</p>
                </div>
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
          <Card className="border-2" style={{ width: '10.6cm', height: '6.6cm', margin: '0 auto' }}>
            <div className="bg-industrial-blue text-white px-3 py-2 flex items-center">
              <div className="h-5 w-5 rounded-full bg-industrial-yellow mr-2"></div>
              <h3 className="text-sm font-bold">CARTEIRINHA PROFISSIONAL</h3>
            </div>
            
            <div className="flex p-3">
              <div className="w-1/3">
                <Avatar className="h-20 w-16 rounded-sm">
                  <AvatarImage src={photo} alt={name} className="object-cover" />
                  <AvatarFallback className="text-lg rounded-sm">
                    {name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h4 className="text-base font-bold mt-2 line-clamp-2">{name}</h4>
                <p className="text-xs text-muted-foreground">ID: {id}</p>
              </div>
              
              <div className="w-2/3 border-l pl-3 ml-2">
                <h5 className="text-xs font-bold mb-1 border-b pb-1">TREINAMENTOS REALIZADOS</h5>
                <div className="space-y-1.5 overflow-y-auto max-h-[80px]">
                  {certificates.slice(0, 6).map((cert, idx) => (
                    <div key={idx} className="flex justify-between border-b border-dotted border-gray-200 pb-1">
                      <span className="text-xs font-medium line-clamp-1">{cert.type}</span>
                      <span className={`text-xs ${
                        cert.status === 'valid' ? 'text-green-600' : 
                        cert.status === 'expired' ? 'text-red-600' : 
                        'text-amber-600'
                      }`}>
                        {formatDate(cert.expiryDate)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-3 pb-2">
              <div className="flex items-center">
                <QrCode size={40} className="text-industrial-blue" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">Emitido em: {new Date().toLocaleDateString('pt-BR')}</p>
                <p className="text-[10px] text-muted-foreground">Verificar autenticidade: {window.location.host}</p>
              </div>
            </div>
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
