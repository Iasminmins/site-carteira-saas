import { useState } from "react";
import { QrCode, Copy, Check, ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { generateQRCode } from "@/lib/qrcode";

interface EmployeeQRCodeDisplayProps {
  employeeId: string;
  employeeName: string;
}

export function EmployeeQRCodeDisplay({ 
  employeeId, 
  employeeName
}: EmployeeQRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate employee URL and QR code
  const employeeUrl = `${window.location.origin}/employee/${employeeId}`;
  const qrCodeUrl = generateQRCode(employeeUrl, 300);
  
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(employeeUrl);
      setCopied(true);
      toast.success("URL copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar URL");
    }
  };
  
  const handleOpenInNewTab = () => {
    window.open(employeeUrl, '_blank');
  };
  
  const handleDownloadQR = async () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        canvas.width = 512;
        canvas.height = 512;
        
        if (ctx) {
          ctx.fillStyle = 'white';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `qrcode-${employeeName.replace(/\s+/g, '-').toLowerCase()}.png`;
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
      
      img.src = generateQRCode(employeeUrl, 512);
    } catch (error) {
      toast.error("Erro ao baixar QR Code");
      console.error(error);
    }
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-shrink-0"
          title="Ver QR Code"
        >
          <Download size={16} />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 pb-3 space-y-1">
          <DialogTitle className="text-xl font-bold">QR Code do Colaborador</DialogTitle>
          <DialogDescription className="text-sm">
            Escaneie para ver os certificados de {employeeName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="px-4 pb-4 space-y-4">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-100 shadow-sm">
              <img 
                src={qrCodeUrl} 
                alt="QR Code" 
                className="w-48 h-48 object-contain"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              URL do Colaborador:
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={employeeUrl} 
                readOnly 
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-industrial-blue"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                title="Copiar URL"
                className="h-9 w-9"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenInNewTab}
                title="Abrir em nova aba"
                className="h-9 w-9"
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              size="sm"
              onClick={handleDownloadQR}
            >
              <Download size={16} className="mr-2" />
              Baixar QR Code
            </Button>
            <Button 
              className="flex-1 bg-industrial-blue hover:bg-industrial-blue/90"
              size="sm"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink size={16} className="mr-2" />
              Ver Certificados
            </Button>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
            <div className="flex items-start gap-2">
              <QrCode className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
              <div className="space-y-1">
                <p className="font-semibold text-xs text-blue-900">📱 Como usar:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-xs text-blue-800">
                  <li>Abra o app de câmera do celular</li>
                  <li>Aponte para o QR code</li>
                  <li>Toque na notificação</li>
                  <li>Verá os certificados</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
