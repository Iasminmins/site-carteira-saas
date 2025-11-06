/**
 * QR Code Generation Utilities
 * Provides consistent QR code generation across the application
 */

/**
 * Get the base URL for the application
 * FUNCIONA AUTOMATICAMENTE com qualquer domínio!
 * Detecta automaticamente o domínio atual (localhost, staging, produção)
 * Não precisa de configuração manual em .env
 */
function getBaseUrl(): string {
  // SEMPRE usa o domínio atual automaticamente
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback apenas para SSR (Server-Side Rendering)
  // Em casos normais, sempre usará window.location.origin acima
  return 'http://localhost:5173';
}

/**
 * Generate a QR code URL for a certificate
 * FUNCIONA AUTOMATICAMENTE - detecta o domínio atual!
 * @param certificateId - The unique ID of the certificate
 * @param size - The size of the QR code in pixels (default: 150)
 * @returns The URL to the QR code image
 */
export function generateCertificateQRCode(certificateId: string, size: number = 150): string {
  const baseUrl = getBaseUrl();
  
  // Cria a URL do certificado usando o domínio atual automaticamente
  const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
  
  // Gera QR Code usando API externa (funciona offline depois de carregar)
  // Usa encodeURIComponent para garantir que a URL seja codificada corretamente
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(certificateUrl)}`;
}

/**
 * Generate a QR code URL with custom data
 * @param data - The data to encode in the QR code
 * @param size - The size of the QR code in pixels (default: 150)
 * @returns The URL to the QR code image
 */
export function generateQRCode(data: string, size: number = 150): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
}

/**
 * Generate a QR code URL with logo/icon in the center
 * @param data - The data to encode in the QR code
 * @param size - The size of the QR code in pixels (default: 150)
 * @param logoUrl - URL to the logo/icon to embed (optional)
 * @returns The URL to the QR code image with logo
 */
export function generateQRCodeWithLogo(
  data: string, 
  size: number = 150,
  logoUrl?: string
): string {
  let qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
  
  // Add logo if provided
  if (logoUrl) {
    qrUrl += `&qzone=1&logo=${encodeURIComponent(logoUrl)}`;
  }
  
  return qrUrl;
}

/**
 * Validate if a string is a valid certificate URL
 * @param url - The URL to validate
 * @returns True if valid certificate URL, false otherwise
 */
export function isValidCertificateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname.startsWith('/certificate/');
  } catch {
    return false;
  }
}

/**
 * Extract certificate ID from a certificate URL
 * @param url - The certificate URL
 * @returns The certificate ID or null if invalid
 */
export function extractCertificateId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const match = urlObj.pathname.match(/\/certificate\/(.+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Generate a downloadable QR code data URL
 * Note: This requires a library like qrcode.react or qrcode
 * This is a placeholder for future implementation
 */
export async function generateDownloadableQRCode(
  certificateId: string,
  size: number = 300
): Promise<string> {
  // For now, return the API URL
  // In production, you might want to use a library to generate the QR code client-side
  return generateCertificateQRCode(certificateId, size);
}

/**
 * 🔧 FUNÇÃO DE DEBUG - Mostra informações sobre a geração do QR Code
 * Use para verificar se o QR Code está sendo gerado corretamente
 * @param certificateId - ID do certificado
 * @returns Objeto com informações de debug
 */
export function debugQRCode(certificateId: string) {
  const baseUrl = getBaseUrl();
  const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
  const qrCodeUrl = generateCertificateQRCode(certificateId);
  
  const debugInfo = {
    baseUrl,
    certificateUrl,
    qrCodeUrl,
    protocol: window.location.protocol,
    hostname: window.location.hostname,
    port: window.location.port,
    fullUrl: window.location.href,
    message: '✅ QR Code configurado para funcionar automaticamente com qualquer domínio!'
  };
  
  console.log('🔍 Debug QR Code:', debugInfo);
  
  return debugInfo;
}
