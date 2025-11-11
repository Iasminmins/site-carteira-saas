import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { QRCodeDisplay } from "./QRCodeDisplay";
import { generateCertificateQRCode } from "@/lib/qrcode";

interface CertificateCardProps {
  id: string;
  title: string;
  type: string;
  issuedDate: Date;
  expiryDate: Date;
  status: "valid" | "expired" | "expiring";
  qrCode?: string;
  employeeName?: string;
  employeePhoto?: string;
  showEmployee?: boolean;
  onClick?: () => void;
}

export function CertificateCard({
  id,
  title,
  type,
  issuedDate,
  expiryDate,
  status,
  qrCode,
  employeeName,
  employeePhoto,
  showEmployee = false,
  onClick
}: CertificateCardProps) {
  const getStatusConfig = (status: string) => {
    switch(status) {
      case "valid":
        return { label: "Válido", variant: "outline", color: "text-green-600" };
      case "expired":
        return { label: "Expirado", variant: "destructive", color: "text-destructive" };
      case "expiring":
        return { label: "Expirando", variant: "secondary", color: "text-amber-500" };
      default:
        return { label: "Indefinido", variant: "outline", color: "text-gray-500" };
    }
  };
  
  const { label, color } = getStatusConfig(status);
  
  // Gera o QR code usando a função do frontend (sempre correto)
  const qrCodeUrl = qrCode || generateCertificateQRCode(id);
  
  return (
    <Card 
      className="card-hover cursor-pointer overflow-hidden w-full max-w-sm mx-auto" 
      onClick={onClick}
    >
      {/* Header com cor de destaque */}
      <div className="bg-industrial-blue text-white py-2 px-3 flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-industrial-yellow flex-shrink-0"></div>
        <span className="text-xs font-bold uppercase tracking-wide">Carteirinha Profissional</span>
      </div>
      
      <CardHeader className="pb-3 pt-3 px-4 space-y-2">
        {/* Badges de tipo e status */}
        <div className="flex justify-between items-start gap-2">
          <Badge variant="outline" className="bg-industrial-blue/10 text-industrial-blue text-xs px-2 py-0.5">
            {type}
          </Badge>
          <Badge 
            variant={status === "valid" ? "outline" : status === "expired" ? "destructive" : "secondary"}
            className="text-xs px-2 py-0.5"
          >
            {label}
          </Badge>
        </div>
        
        {/* Título do certificado */}
        <CardTitle className="text-sm font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2 pt-0 px-4 space-y-3">
        {/* Informações do colaborador (se mostrar) */}
        {showEmployee && (
          <div className="flex items-center gap-2 pb-2 border-b">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {employeePhoto && (
                <img 
                  src={employeePhoto} 
                  alt={employeeName} 
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <span className="text-xs font-medium truncate flex-1">{employeeName}</span>
          </div>
        )}
        
        {/* Datas de emissão e validade */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Emissão</p>
            <p className="text-xs font-semibold mt-0.5">{format(issuedDate, 'dd/MM/yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Validade</p>
            <p className={`text-xs font-semibold mt-0.5 ${color}`}>
              {format(expiryDate, 'dd/MM/yyyy')}
            </p>
          </div>
        </div>
      </CardContent>
      
      {/* QR Code no rodapé - Agora clicável e interativo */}
      <CardFooter className="pb-3 pt-2 px-4 flex justify-center border-t bg-gray-50/50">
        <div onClick={(e) => e.stopPropagation()}>
          <QRCodeDisplay 
            qrCodeUrl={qrCodeUrl}
            certificateId={id}
            size="sm"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
