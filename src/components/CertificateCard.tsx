
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

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
  
  return (
    <Card 
      className="card-hover cursor-pointer relative" 
      onClick={onClick}
      style={{ 
        width: '10.6cm',
        height: '6.6cm',
        margin: '0 auto',
        padding: '0.5cm', // Garantindo margens internas de 0.5cm
        boxSizing: 'border-box'
      }}
    >
      <div className="absolute top-0 left-0 w-full bg-industrial-blue text-white py-2 px-4 flex items-center">
        <div className="h-5 w-5 rounded-full bg-industrial-yellow mr-2"></div>
        <span className="text-sm font-bold">CARTEIRINHA PROFISSIONAL</span>
      </div>
      
      <CardHeader className="pb-2 pt-8">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-industrial-blue/10 text-industrial-blue">
            {type}
          </Badge>
          <Badge variant={status === "valid" ? "outline" : status === "expired" ? "destructive" : "secondary"}>
            {label}
          </Badge>
        </div>
        <CardTitle className="text-base mt-2 line-clamp-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-2">
        {showEmployee && (
          <div className="flex items-center mb-3">
            <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
              {employeePhoto && <img src={employeePhoto} alt={employeeName} className="h-full w-full object-cover" />}
            </div>
            <span className="ml-2 text-sm font-medium">{employeeName}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Emissão</p>
            <p className="text-sm font-medium">{format(issuedDate, 'dd/MM/yyyy')}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Validade</p>
            <p className={`text-sm font-medium ${color}`}>{format(expiryDate, 'dd/MM/yyyy')}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <div className="flex-1 flex justify-center items-center py-2">
          {qrCode && <img src={qrCode} alt="QR Code" className="h-20 w-20" />}
        </div>
      </CardFooter>
    </Card>
  );
}
