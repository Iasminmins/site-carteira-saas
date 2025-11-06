import { useState } from "react";
import { QrCode, Copy, Check, ExternalLink } from "lucide-react";
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

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  certificateId: string;
  certificateUrl?: string;
  size?: "sm" | "md" | "lg";
}

export function QRCodeDisplay({ 
  qrCodeUrl, 
  certificateId, 
  certificateUrl,
  size = "md" 
}: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Determine the full certificate URL
  const fullUrl = certificateUrl || `${window.location.origin}/certificate/${certificateId}`;
  
  // Size configurations
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32"
  };
  
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("URL copiada para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar URL");
    }
  };
  
  const handleOpenInNewTab = () => {
    window.open(fullUrl, '_blank');
  };
  
  const handleDownloadQR = () => {
    // Create a temporary link to download the QR code
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qrcode-${certificateId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("QR Code baixado com sucesso!");
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative cursor-pointer group">
          <img 
            src={qrCodeUrl} 
            alt="QR Code" 
            className={`${sizeClasses[size]} object-contain transition-transform group-hover:scale-105`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className={`${sizeClasses[size]} bg-gray-200 animate-pulse rounded`} />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded flex items-center justify-center">
            <QrCode className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code do Certificado</DialogTitle>
          <DialogDescription>
            Escaneie este QR code para acessar o certificado diretamente
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4">
          {/* Large QR Code Display */}
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="w-64 h-64 object-contain"
            />
          </div>
          
          {/* Certificate URL */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              URL do Certificado:
            </label>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={fullUrl} 
                readOnly 
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-gray-50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyUrl}
                title="Copiar URL"
              >
                {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenInNewTab}
                title="Abrir em nova aba"
              >
                <ExternalLink size={16} />
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 w-full">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleDownloadQR}
            >
              <QrCode size={16} className="mr-2" />
              Baixar QR Code
            </Button>
            <Button 
              className="flex-1"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink size={16} className="mr-2" />
              Abrir Certificado
            </Button>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 w-full">
            <p className="font-medium mb-1">📱 Como usar:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Abra o app de câmera do seu celular</li>
              <li>Aponte para o QR code</li>
              <li>Toque na notificação que aparecer</li>
              <li>Será redirecionado para o certificado</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
