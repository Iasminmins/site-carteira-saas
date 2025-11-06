# Sistema de QR Codes - Carteira Digital (✅ 100% Automático!)

## 🎉 ATUALIZAÇÃO: Agora Funciona Automaticamente!

O sistema foi **totalmente otimizado** para funcionar automaticamente com qualquer domínio, sem necessidade de configuração manual!

## 📱 Como Funciona

O sistema de QR codes permite que qualquer pessoa escaneie o código e seja **automaticamente redirecionada** para a página pública do certificado.

### Fluxo do QR Code:

```
1. Certificado criado → ID gerado (ex: cert-001)
2. URL completa gerada AUTOMATICAMENTE com o domínio atual
3. QR Code gerado com a URL completa
4. Usuário escaneia QR Code
5. Redirecionado automaticamente para /certificate/cert-001
6. Página pública do certificado é exibida
```

## 🔧 Configuração

### ✅ ZERO Configuração Necessária!

O sistema **detecta automaticamente** o domínio onde está rodando:

**Desenvolvimento (localhost):**
```
URL base: http://localhost:5173 (detectado automaticamente)
URL do certificado: http://localhost:5173/certificate/cert-001
```

**Rede Local (para testar no celular):**
```
URL base: http://192.168.1.100:5173 (detectado automaticamente)
URL do certificado: http://192.168.1.100:5173/certificate/cert-001
```

**Produção:**
```
URL base: https://seusite.com.br (detectado automaticamente)
URL do certificado: https://seusite.com.br/certificate/cert-001
```

### Como Funciona a Detecção Automática?

O sistema usa `window.location.origin` para detectar o domínio atual:

```typescript
// SEMPRE detecta automaticamente!
const baseUrl = window.location.origin; // Ex: https://meusite.com

// Gera a URL do certificado
const certificateUrl = `${baseUrl}/certificate/${certificateId}`;
```

**Vantagens:**
- ✅ Funciona em localhost
- ✅ Funciona na sua rede local (IP)
- ✅ Funciona em staging
- ✅ Funciona em produção
- ✅ Funciona com Ngrok/túneis
- ✅ Não precisa editar .env
- ✅ Não precisa hardcode de URLs

## 🎯 Uso nos Componentes

### 1. Usar o QR Code nos Cards

```tsx
import { QRCodeDisplay } from "@/components/QRCodeDisplay";

<QRCodeDisplay 
  qrCodeUrl={certificate.qrCode}
  certificateId={certificate.id}
  size="md"
/>
```

### 2. Gerar QR Code programaticamente

```tsx
import { generateCertificateQRCode } from "@/lib/qrcode";

const qrCodeUrl = generateCertificateQRCode("cert-001", 150);
```

## 📱 Testando QR Codes

### No Celular:
1. Abra a câmera do celular
2. Aponte para o QR code na tela do computador
3. Clique na notificação
4. Deve abrir a página do certificado

## ✅ Status Atual

- ✅ QR codes gerando URLs completas
- ✅ Redirecionamento automático funcionando
- ✅ Componente QRCodeDisplay criado
- ✅ Utilitários de geração criados
- ✅ Suporte a domínios dinâmicos
- ✅ Compatível com produção
