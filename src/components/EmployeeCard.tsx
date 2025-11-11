
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
import { FileText, Award, Badge as CertificateBadge, IdCard, QrCode, Check, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateQRCode } from "@/lib/qrcode";
import { toast } from "sonner";

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
  
  // Gera QR Code para a página pública do funcionário (mostra TODOS os certificados)
  const employeeUrl = `${window.location.origin}/employee/${id}`;
  const qrCodeUrl = generateQRCode(employeeUrl, 120);
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };
  
  // Navigate to employee details
  const handleViewDetails = () => {
    navigate(`/admin/employees/${id}`);
  };
  
  // Function to download QR code
  const handleDownloadQRCode = async () => {
    try {
      // Criar um canvas para desenhar o QR code em alta qualidade
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      // Permitir CORS para a imagem
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Tamanho maior para melhor qualidade
        canvas.width = 512;
        canvas.height = 512;
        
        if (ctx) {
          // Fundo branco
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Desenhar o QR code
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Converter para blob e fazer download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `qrcode-${name.replace(/\s+/g, '-').toLowerCase()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              
              toast.success("QR Code baixado com sucesso!");
            }
          }, 'image/png');
        }
      };
      
      img.onerror = () => {
        toast.error("Erro ao baixar QR Code");
      };
      
      // Usar um QR code de tamanho maior para download
      img.src = generateQRCode(employeeUrl, 512);
    } catch (error) {
      toast.error("Erro ao baixar QR Code");
      console.error(error);
    }
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
                width: 7cm; 
                height: 10cm;
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
                width: 40px;
                height: 40px;
                border: 1px dashed #000;
                margin-right: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 9px;
              }
              .header-title {
                flex: 1;
              }
              .card-title {
                margin: 0;
                font-size: 10px;
                font-weight: 700;
                text-transform: uppercase;
              }
              .photo-placeholder {
                width: 65px;
                height: 80px;
                border: 1px dashed #000;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 4px 0;
                font-size: 8px;
              }
              .employee-info {
                padding: 6px;
                border-bottom: 1px dashed #000;
                font-size: 8px;
              }
              .info-row {
                margin-bottom: 2px;
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
                padding: 4px;
                font-size: 7px;
              }
              .auth-column:last-child {
                border-right: none;
              }
              .auth-header {
                font-weight: bold;
                text-align: center;
                margin-bottom: 4px;
                font-size: 7px;
                text-transform: uppercase;
              }
              .auth-item {
                display: flex;
                margin-bottom: 2px;
                font-size: 6px;
              }
              .auth-checkbox {
                width: 8px;
                height: 8px;
                border: 1px solid #000;
                margin-right: 3px;
                font-size: 6px;
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
                padding: 4px;
                border-top: 1px dashed #000;
              }
              .signature-box {
                flex: 1;
                text-align: center;
                padding: 2px;
                font-size: 6px;
              }
              .signature-line {
                height: 18px;
                border-bottom: 1px solid #000;
                margin-bottom: 2px;
              }
              .emergency-contacts {
                padding: 4px;
                font-size: 6px;
                text-align: center;
                border-top: 1px dashed #000;
              }
              .qrcode-section {
                padding: 4px;
                text-align: center;
                border-top: 1px dashed #000;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .qrcode-img {
                width: 45px;
                height: 45px;
                border: 1px solid #000;
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
                  size: 7.5cm 10.5cm;
                  margin: 0;
                }
              }
            </style>
          </head>
          <body onload="setTimeout(function() { window.print(); }, 500)">
            <div class="card-container">
              <div class="card-header">
                <div class="company-logo">Logo</div>
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
                  <div>SESMT<br/>ELABORADO POR:</div>
                </div>
                <div class="signature-box">
                  <div class="signature-line"></div>
                  <div>SESMT<br/>APROVADO POR:</div>
                </div>
              </div>
              
              <!-- QR Code Section -->
              <div class="qrcode-section">
                ${qrCodeUrl ? `
                  <div>
                    <img src="${qrCodeUrl}" alt="QR Code" class="qrcode-img" />
                    <div style="font-size: 7px; margin-top: 3px;">Escaneie para verificar</div>
                  </div>
                ` : ''}
              </div>
              
              <div class="emergency-contacts">
                <strong>RAMAIS DE EMERGÊNCIA</strong><br/>
                SESMT: 33443866 / Posto médico: 33407<br/>
                Bombeiro: 33444000-5555 / Ambulância: 33455<br/>
                Guarda Patrimonial: 33444888-4673
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
            <Card className="border-2 border-dashed border-black" style={{ width: '7cm', margin: '0 auto' }}>
              {/* Header with logo and title */}
              <div className="flex p-1.5 border-b border-dashed border-black">
                <div className="flex items-center justify-center w-10 h-10 border border-dashed border-black mr-2 font-bold text-[9px]">
                  LOGO
                </div>
                <div>
                  <h3 className="text-[10px] font-bold uppercase">Carteira de Autorização</h3>
                  <div className="flex items-center justify-center w-16 h-20 border border-dashed border-black mt-1 text-[8px] text-center leading-tight px-1">
                    Portar documento com foto
                  </div>
                </div>
              </div>
              
              {/* Employee info */}
              <div className="p-1.5 border-b border-dashed border-black text-[8px]">
                <div className="mb-0.5">
                  <span className="font-bold">Nome:</span> {name}
                </div>
                <div className="mb-0.5">
                  <span className="font-bold">Matrícula:</span> {id}
                </div>
                <div className="mb-0.5">
                  <span className="font-bold">Função:</span> {certificates[0]?.type || 'N/A'}
                </div>
                <div className="mb-0.5">
                  <span className="font-bold">Contrato:</span> TÉCNICO MANUTENÇÃO
                </div>
                <div className="mb-0.5">
                  <span className="font-bold">Integração:</span> {formatDate(new Date())}
                  <span className="ml-2 font-bold">ASO:</span> {formatDate(new Date(Date.now() + 30*24*60*60*1000))}
                </div>
              </div>
              
              {/* Authorization columns */}
              <div className="flex">
                <div className="w-1/2 p-1 border-r border-dashed border-black">
                  <div className="text-[7px] font-bold uppercase text-center mb-1">
                    Trabalhador Autorizado / Validade
                  </div>
                  <div className="space-y-0.5">
                    {certificates.slice(0, 7).map((cert, idx) => (
                      <div key={idx} className="flex items-center text-[6px]">
                        <div className={`w-2 h-2 border border-black mr-0.5 flex items-center justify-center ${cert.status === 'valid' ? 'bg-gray-200' : ''}`}>
                          {cert.status === 'valid' && <Check size={6} />}
                        </div>
                        <div className="flex-1 leading-tight">{cert.type}</div>
                        <div className="w-12 text-right">{formatDate(cert.expiryDate)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="w-1/2 p-1">
                  <div className="text-[7px] font-bold uppercase text-center mb-1">
                    Operação/Execução
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center text-[6px]">
                      <div className="w-2 h-2 border border-black mr-0.5"></div>
                      <div className="flex-1 leading-tight">DIREÇÃO DEFENSIVA</div>
                      <div className="w-12 text-right">__/__/__</div>
                    </div>
                    <div className="flex items-center text-[6px]">
                      <div className="w-2 h-2 border border-black mr-0.5"></div>
                      <div className="flex-1 leading-tight">VEÍCULO GRANDE PORTE</div>
                      <div className="w-12 text-right">__/__/__</div>
                    </div>
                    <div className="flex items-center text-[6px]">
                      <div className="w-2 h-2 border border-black mr-0.5"></div>
                      <div className="flex-1 leading-tight">TRABALHO A QUENTE</div>
                      <div className="w-12 text-right">__/__/__</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Signatures */}
              <div className="flex p-1 border-t border-dashed border-black">
                <div className="flex-1 text-center">
                  <div className="h-6 border-b border-black mb-0.5"></div>
                  <div className="text-[6px] leading-tight">
                    SESMT<br />
                    ELABORADO POR:
                  </div>
                </div>
                <div className="flex-1 text-center">
                  <div className="h-6 border-b border-black mb-0.5"></div>
                  <div className="text-[6px] leading-tight">
                    SESMT<br />
                    APROVADO POR:
                  </div>
                </div>
              </div>
              
              {/* QR Code Section */}
              <div className="p-1.5 border-t border-dashed border-black text-center">
                {qrCodeUrl && (
                  <>
                    <img 
                      src={qrCodeUrl} 
                      alt="QR Code" 
                      className="w-11 h-11 mx-auto border border-black"
                    />
                    <div className="text-[6px] mt-0.5">Escaneie para verificar</div>
                  </>
                )}
              </div>
              
              {/* Emergency contacts */}
              <div className="p-1 border-t border-dashed border-black text-center">
                <div className="text-[7px] font-bold">RAMAIS DE EMERGÊNCIA</div>
                <div className="text-[6px] leading-tight">
                  SESMT: 33443866 / Posto médico: 3344307<br/>
                  Bombeiro: 33444000-5555 / Ambulância: 33444455<br/>
                  Guarda Patrimonial: 33444888-4673
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
        
        <div className="flex gap-2 justify-between mt-4">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadQRCode}>
              <Download size={16} className="mr-2" />
              QR Code
            </Button>
            <Button onClick={handlePrint}>
              Imprimir Carteirinha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
