
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
import { FileText, Award, Badge as CertificateBadge, IdCard, QrCode, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

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
            <title>Carteira de Autorização - ${name}</title>
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
                height: 15cm;
                margin: 20px auto;
                background: #fff;
                border: 1px dashed #000;
                overflow: hidden;
                position: relative;
                color: #000;
                padding: 0;
                box-sizing: border-box;
              }
              .card-header {
                display: flex;
                padding: 10px;
                border-bottom: 1px dashed #000;
              }
              .company-logo {
                width: 70px;
                height: 70px;
                border: 1px dashed #000;
                margin-right: 15px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
              }
              .header-title {
                flex: 1;
              }
              .card-title {
                margin: 0;
                font-size: 16px;
                font-weight: 700;
                text-transform: uppercase;
              }
              .photo-placeholder {
                width: 120px;
                height: 150px;
                border: 1px dashed #000;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 10px;
              }
              .employee-info {
                padding: 10px;
                border-bottom: 1px dashed #000;
              }
              .info-row {
                margin-bottom: 5px;
              }
              .info-label {
                font-weight: 700;
                display: inline;
              }
              .authorizations {
                display: flex;
                padding: 0;
              }
              .auth-column {
                flex: 1;
                border-right: 1px dashed #000;
                padding: 10px;
              }
              .auth-column:last-child {
                border-right: none;
              }
              .auth-header {
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
                font-size: 12px;
                text-transform: uppercase;
              }
              .auth-item {
                display: flex;
                margin-bottom: 5px;
                font-size: 11px;
              }
              .auth-checkbox {
                width: 14px;
                height: 14px;
                border: 1px solid #000;
                margin-right: 5px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              .checked {
                background-color: #ccc;
              }
              .auth-name {
                flex: 1;
              }
              .auth-date {
                width: 80px;
                text-align: right;
              }
              .signatures {
                display: flex;
                padding: 10px;
                border-top: 1px dashed #000;
              }
              .signature-box {
                flex: 1;
                text-align: center;
                padding: 5px;
                font-size: 10px;
              }
              .signature-line {
                height: 40px;
                border-bottom: 1px solid #000;
                margin-bottom: 5px;
              }
              .emergency-contacts {
                padding: 10px;
                font-size: 10px;
                text-align: center;
                border-top: 1px dashed #000;
              }
              @media print {
                body { background: none; }
                .card-container { 
                  box-shadow: none;
                  border: 1px dashed #000;
                  page-break-inside: avoid;
                  margin: 0;
                }
                @page {
                  size: 11cm 15.5cm;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body onload="setTimeout(function() { window.print(); }, 500)">
            <div class="card-container">
              <div class="card-header">
                <div class="company-logo">CBSI</div>
                <div class="header-title">
                  <h1 class="card-title">Carteira de Autorização</h1>
                  <div class="photo-placeholder">
                    Portar documento com foto
                  </div>
                </div>
              </div>
              
              <div class="employee-info">
                <div class="info-row">
                  <span class="info-label">Nome:</span> ${name}
                </div>
                <div class="info-row">
                  <span class="info-label">Matrícula:</span> ${id}
                </div>
                <div class="info-row">
                  <span class="info-label">Função:</span> ${certificates[0]?.type || 'N/A'}
                </div>
                <div class="info-row">
                  <span class="info-label">Contrato:</span> TÉCNICO MANUTENÇÃO
                </div>
                <div class="info-row">
                  <span class="info-label">Integração:</span> ${formatDate(new Date())} 
                  <span style="margin-left: 20px" class="info-label">ASO:</span> ${formatDate(new Date(Date.now() + 30*24*60*60*1000))}
                </div>
              </div>
              
              <div class="authorizations">
                <div class="auth-column">
                  <div class="auth-header">Trabalhador Autorizado / Validade</div>
                  ${certificates.slice(0, 7).map(cert => `
                    <div class="auth-item">
                      <div class="auth-checkbox ${cert.status === 'valid' ? 'checked' : ''}">
                        ${cert.status === 'valid' ? '✓' : ''}
                      </div>
                      <div class="auth-name">${cert.type}</div>
                      <div class="auth-date">${formatDate(cert.expiryDate)}</div>
                    </div>
                  `).join('')}
                </div>
                <div class="auth-column">
                  <div class="auth-header">Operação/Execução</div>
                  <div class="auth-item">
                    <div class="auth-checkbox"></div>
                    <div class="auth-name">DIREÇÃO DEFENSIVA</div>
                    <div class="auth-date">__/__/__</div>
                  </div>
                  <div class="auth-item">
                    <div class="auth-checkbox"></div>
                    <div class="auth-name">VEÍCULO DE GRANDE PORTE</div>
                    <div class="auth-date">__/__/__</div>
                  </div>
                  <div class="auth-item">
                    <div class="auth-checkbox"></div>
                    <div class="auth-name">TRABALHO A QUENTE</div>
                    <div class="auth-date">__/__/__</div>
                  </div>
                </div>
              </div>
              
              <div class="signatures">
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div>SESMT CBSI<br/>ELABORADO POR:</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div>SESMT CBSI<br/>APROVADO POR:</div>
                </div>
              </div>
              
              <div class="emergency-contacts">
                <strong>RAMAIS DE EMERGÊNCIA</strong><br/>
                SESMT CBSI: 33443866 / Posto médico CBSI: 3344307<br/>
                Bombeiro CSN: 33444000-5555 / Ambulância CSN: 33444455<br/>
                Guarda Patrimonial CSN: 33444888-4673
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Carteira de Autorização</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div id="employee-card-print" className="mt-4">
            <Card className="border-2 border-dashed border-black" style={{ width: '10.6cm', margin: '0 auto' }}>
              {/* Header with logo and title */}
              <div className="flex p-3 border-b border-dashed border-black">
                <div className="flex items-center justify-center w-16 h-16 border border-dashed border-black mr-3 font-bold">
                  CBSI
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase">Carteira de Autorização</h3>
                  <div className="flex items-center justify-center w-24 h-28 border border-dashed border-black mt-2 text-xs text-center">
                    Portar documento com foto
                  </div>
                </div>
              </div>
              
              {/* Employee info */}
              <div className="p-3 border-b border-dashed border-black">
                <div className="mb-1">
                  <span className="font-bold">Nome:</span> {name}
                </div>
                <div className="mb-1">
                  <span className="font-bold">Matrícula:</span> {id}
                </div>
                <div className="mb-1">
                  <span className="font-bold">Função:</span> {certificates[0]?.type || 'N/A'}
                </div>
                <div className="mb-1">
                  <span className="font-bold">Contrato:</span> TÉCNICO MANUTENÇÃO
                </div>
                <div className="mb-1">
                  <span className="font-bold">Integração:</span> {formatDate(new Date())}
                  <span className="ml-4 font-bold">ASO:</span> {formatDate(new Date(Date.now() + 30*24*60*60*1000))}
                </div>
              </div>
              
              {/* Authorization columns */}
              <div className="flex">
                <div className="w-1/2 p-2 border-r border-dashed border-black">
                  <div className="text-xs font-bold uppercase text-center mb-2">
                    Trabalhador Autorizado / Validade
                  </div>
                  <div className="space-y-1">
                    {certificates.slice(0, 7).map((cert, idx) => (
                      <div key={idx} className="flex items-center text-xs">
                        <div className={`w-4 h-4 border border-black mr-1 flex items-center justify-center ${cert.status === 'valid' ? 'bg-gray-200' : ''}`}>
                          {cert.status === 'valid' && <Check size={10} />}
                        </div>
                        <div className="flex-1">{cert.type}</div>
                        <div className="w-16 text-right">{formatDate(cert.expiryDate)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-1/2 p-2">
                  <div className="text-xs font-bold uppercase text-center mb-2">
                    Operação/Execução
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <div className="w-4 h-4 border border-black mr-1"></div>
                      <div className="flex-1">DIREÇÃO DEFENSIVA</div>
                      <div className="w-16 text-right">__/__/__</div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-4 h-4 border border-black mr-1"></div>
                      <div className="flex-1">VEÍCULO DE GRANDE PORTE</div>
                      <div className="w-16 text-right">__/__/__</div>
                    </div>
                    <div className="flex items-center text-xs">
                      <div className="w-4 h-4 border border-black mr-1"></div>
                      <div className="flex-1">TRABALHO A QUENTE</div>
                      <div className="w-16 text-right">__/__/__</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signatures */}
              <div className="flex p-2 border-t border-dashed border-black">
                <div className="flex-1 text-center">
                  <div className="h-12 border-b border-black mb-1"></div>
                  <div className="text-xs">
                    SESMT CBSI<br />
                    ELABORADO POR:
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="h-12 border-b border-black mb-1"></div>
                  <div className="text-xs">
                    SESMT CBSI<br />
                    APROVADO POR:
                  </div>
                </div>
              </div>
              
              {/* Emergency contacts */}
              <div className="p-2 border-t border-dashed border-black text-center">
                <div className="text-xs font-bold">RAMAIS DE EMERGÊNCIA</div>
                <div className="text-[10px]">
                  SESMT CBSI: 33443866 / Posto médico CBSI: 3344307<br/>
                  Bombeiro CSN: 33444000-5555 / Ambulância CSN: 33444455<br/>
                  Guarda Patrimonial CSN: 33444888-4673
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
        
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
